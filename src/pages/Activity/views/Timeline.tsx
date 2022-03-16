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
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { EventCardWrapper } from '../../../components/Cards/EventCards/EventCardWrapper';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFTimelineHeader } from '../../../components/Headers/TimelineHeader';
import { EventSlide } from '../../../components/Slides/EventSlide';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { FFTimeline } from '../../../components/Timeline/FFTimeline';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  EventCategoryEnum,
  FF_NAV_PATHS,
  FF_Paths,
  ICreatedFilter,
  IEvent,
  IPagedEventResponse,
  ITimelineElement,
  ITransaction,
} from '../../../interfaces';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import {
  fetchCatcher,
  fetchWithCredentials,
  makeEventHistogram,
} from '../../../utils';
import { isHistogramEmpty } from '../../../utils/charts';
import { isOppositeTimelineEvent } from '../../../utils/timeline';

const ROWS_PER_PAGE = 25;

export const ActivityTimeline: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();
  const [events, setEvents] = useState<IEvent[]>();
  const { t } = useTranslation();
  const [viewTx, setViewTx] = useState<ITransaction>();
  const [viewEvent, setViewEvent] = useState<IEvent>();

  const loadingRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(loadingRef, {});
  const isVisible = !!observer?.isIntersecting;
  const queryClient = useQueryClient();

  // Events Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Events,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Large
      )}`
    )
      .then((histEvents) => {
        setEventHistData(makeEventHistogram(histEvents));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  // Timeline useEffect
  useEffect(() => {
    const qParams = `?limit=25&fetchreferences=true`;

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}`
    )
      .then((recentEvents) => {
        setEvents(recentEvents);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const { data, isFetching, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery(
      'transactions',
      async ({ pageParam = 0 }) => {
        console.log(pageParam);
        console.log('YYYER');
        const createdFilterObject: ICreatedFilter =
          getCreatedFilter(createdFilter);

        const res = await fetchWithCredentials(
          `/api/v1/namespaces/${selectedNamespace}/events?count&limit=${ROWS_PER_PAGE}&skip=${
            ROWS_PER_PAGE * pageParam
          }${createdFilterObject.filterString}${
            ''
            // filterString !== undefined ? filterString : ''
          }`
        );
        if (res.ok) {
          const data = await res.json();
          return {
            pageParam,
            ...data,
          };
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
    console.log('1');
    if (isVisible && hasNextPage) {
      fetchNextPage();
    }
  }, [isVisible, hasNextPage, fetchNextPage]);

  useEffect(() => {
    console.log('2');
    refetch();
  }, [createdFilter, queryClient, refetch]);

  useEffect(() => {
    console.log('3');
    refetch({ refetchPage: (_page, index) => index === 0 });
  }, [lastEvent, refetch]);

  const timelineElements: ITimelineElement[] | undefined = events?.map(
    (event) => ({
      key: event.id,
      item: (
        <EventCardWrapper
          onHandleViewEvent={(event: IEvent) => setViewEvent(event)}
          onHandleViewTx={(tx: ITransaction) => setViewTx(tx)}
          link={FF_NAV_PATHS.activityTxDetailPath(selectedNamespace, event.tx)}
          {...{ event }}
        />
      ),
      opposite: isOppositeTimelineEvent(event.type),
      timestamp: event.created,
    })
  );

  return (
    <>
      <Header title={t('timeline')} subtitle={t('activity')} />
      <Grid container px={DEFAULT_PADDING} direction="column" spacing={2}>
        <Grid item>
          <Histogram
            colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
            data={eventHistData}
            indexBy="timestamp"
            keys={[
              EventCategoryEnum.BLOCKCHAIN,
              EventCategoryEnum.MESSAGES,
              EventCategoryEnum.TOKENS,
            ]}
            includeLegend={true}
            isEmpty={isHistogramEmpty(eventHistData ?? [])}
            emptyText={t('noActivity')}
          />
        </Grid>
        <Grid container justifyContent={'center'} direction="column" item>
          <FFTimelineHeader
            leftHeader={t('submittedByMe')}
            rightHeader={t('receivedFromEveryone')}
          />
          <FFTimeline
            elements={timelineElements}
            emptyText={t('noTimelineEvents')}
            height={'calc(100vh - 400px)'}
            observerRef={loadingRef}
            {...{ isFetching }}
          />
        </Grid>
      </Grid>
      {viewEvent && (
        <EventSlide
          event={viewEvent}
          open={!!viewEvent}
          onClose={() => {
            setViewEvent(undefined);
          }}
        />
      )}
      {viewTx && (
        <TransactionSlide
          transaction={viewTx}
          open={!!viewTx}
          onClose={() => {
            setViewTx(undefined);
          }}
        />
      )}
    </>
  );
};
