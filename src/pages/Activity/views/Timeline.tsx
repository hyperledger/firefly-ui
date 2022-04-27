// Copyright © 2022 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InfiniteData, useInfiniteQuery, useQueryClient } from 'react-query';
import { EventCardWrapper } from '../../../components/Cards/EventCards/EventCardWrapper';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { FFTimelineHeader } from '../../../components/Headers/TimelineHeader';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { EventSlide } from '../../../components/Slides/EventSlide';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { FFTimeline } from '../../../components/Timeline/FFTimeline';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  EventFilters,
  FF_NAV_PATHS,
  FF_Paths,
  IEvent,
  IPagedEventResponse,
  ITransaction,
} from '../../../interfaces';
import { altScrollbarStyle, DEFAULT_PADDING } from '../../../theme';
import { fetchCatcher, fetchWithCredentials } from '../../../utils';
import { isOppositeTimelineEvent } from '../../../utils/timeline';
import { hasAnyEvent } from '../../../utils/wsEvents';

const ROWS_PER_PAGE = 25;

export const ActivityTimeline: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();
  const [viewTx, setViewTx] = useState<ITransaction>();
  const [viewEvent, setViewEvent] = useState<IEvent>();
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && slideID) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}?id=${slideID}`
      ).then((eventRes: IEvent[]) => {
        isMounted && eventRes.length > 0 && setViewEvent(eventRes[0]);
      });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.transactions}?id=${slideID}`
      ).then((txRes: ITransaction[]) => {
        isMounted && txRes.length > 0 && setViewTx(txRes[0]);
      });
    }
  }, [slideID, isMounted]);

  const { data, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery(
    'events',
    async ({ pageParam = 0 }) => {
      const res = await fetchWithCredentials(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.events
        }?count&limit=${ROWS_PER_PAGE}&skip=${ROWS_PER_PAGE * pageParam}${
          dateFilter?.filterString ?? ''
        }${filterString ?? ''}&fetchreferences`
      );
      if (res.ok) {
        const data = await res.json();
        return {
          pageParam,
          ...data,
        };
      } else {
        reportFetchError(res.statusText);
      }
    },
    {
      getNextPageParam: (lastPage: IPagedEventResponse) => {
        return lastPage.count === ROWS_PER_PAGE
          ? lastPage.pageParam + 1
          : undefined;
      },
    }
  );

  useEffect(() => {
    if (isVisible && hasNextPage && isMounted) {
      fetchNextPage();
    }
  }, [isVisible, hasNextPage, fetchNextPage, isMounted]);

  useEffect(() => {
    isMounted && refetch();
  }, [dateFilter, queryClient, refetch, filterString, isMounted]);

  useEffect(() => {
    if (isMounted) {
      refetch({ refetchPage: (_page, index) => index === 0 });
    }
  }, [refetch, lastRefreshTime, isMounted]);

  const buildTimelineElements = (
    data: InfiniteData<IPagedEventResponse> | undefined
  ) => {
    if (isMounted && data) {
      const pages = data.pages.map((page) => page.items);
      return pages.flat().map((event: IEvent, idx) => ({
        key: idx,
        item: (
          <EventCardWrapper
            onHandleViewEvent={(event: IEvent) => {
              if (event.transaction) {
                setViewTx(event.transaction);
                setSlideSearchParam(event?.tx ?? null);
              } else {
                setViewEvent(event);
                setSlideSearchParam(event?.id);
              }
            }}
            link={
              event.transaction
                ? FF_NAV_PATHS.activityTxDetailPath(
                    selectedNamespace,
                    event.transaction.id
                  )
                : FF_NAV_PATHS.activityTxDetailPathWithSlide(
                    selectedNamespace,
                    event.tx ?? '',
                    event.id
                  )
            }
            {...{ event }}
          />
        ),
        opposite: isOppositeTimelineEvent(event.type),
        timestamp: event.created,
      }));
    } else {
      return undefined;
    }
  };

  return (
    <>
      <Header
        title={t('timeline')}
        subtitle={t('activity')}
        showRefreshBtn={false}
      />
      <FFPageLayout>
        <Grid
          container
          justifyContent={'center'}
          direction="column"
          item
          pt={DEFAULT_PADDING}
          sx={altScrollbarStyle}
        >
          <FFTimelineHeader
            leftHeader={t('submittedByMe')}
            rightHeader={t('receivedFromEveryone')}
          />
          <FFTimeline
            elements={buildTimelineElements(data)}
            emptyText={t('noTimelineEvents')}
            height={'75vh'}
            fetchMoreData={() => setIsVisible(isVisible + 1)}
            hasMoreData={hasNextPage}
            hasNewEvents={hasAnyEvent(newEvents)}
            fetchNewData={clearNewEvents}
          />
        </Grid>
      </FFPageLayout>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={EventFilters}
        />
      )}
      {viewEvent && (
        <EventSlide
          event={viewEvent}
          open={!!viewEvent}
          onClose={() => {
            setViewEvent(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
      {viewTx && (
        <TransactionSlide
          transaction={viewTx}
          open={!!viewTx}
          onClose={() => {
            setViewTx(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
