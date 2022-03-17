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

import { Chip, Grid } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventCardWrapper } from '../../../components/Cards/EventCards/EventCardWrapper';
import { Histogram } from '../../../components/Charts/Histogram';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { MessageSlide } from '../../../components/Slides/MessageSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_NAV_PATHS,
  FF_Paths,
  ICreatedFilter,
  IDataTableRecord,
  IEvent,
  IMessage,
  IMetric,
  IPagedMessageResponse,
  ITimelineElement,
  ITransaction,
  MessageFilters,
} from '../../../interfaces';
import {
  FF_MESSAGES_CATEGORY_MAP,
  MsgStateColorMap,
} from '../../../interfaces/enums';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import {
  fetchCatcher,
  getCreatedFilter,
  getFFTime,
  isOppositeTimelineEvent,
  makeMsgHistogram,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

export const OffChainMessages: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const {
    filterAnchor,
    setFilterAnchor,
    activeFilters,
    setActiveFilters,
    filterString,
  } = useContext(FilterContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [viewTx, setViewTx] = useState<ITransaction>();
  const [viewEvent, setViewEvent] = useState<IEvent>();
  const [events, setEvents] = useState<IEvent[]>();
  // Messages
  const [messages, setMessages] = useState<IMessage[]>();
  const [messageTotal, setMessageTotal] = useState(0);
  // Message totals
  const [eventsTotal, setEventsTotal] = useState(0);
  // Messages histogram
  const [messageHistData, setMessageHistData] = useState<BarDatum[]>();
  // View message slide out
  const [viewMsg, setViewMsg] = useState<IMessage | undefined>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Messages
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    //   fetchCatcher(
    //     `${FF_Paths.nsPrefix}/${selectedNamespace}${
    //       FF_Paths.events
    //     }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
    //       createdFilterObject.filterString
    //     }`
    //   )
    //     .then((eventRes: IPagedEventResponse) => {
    //       setEvents(eventRes.items);
    //       setEventsTotal(eventRes.total);
    //     })
    //     .catch((err) => {
    //       reportFetchError(err);
    //     });
    // }, [rowsPerPage, currentPage, selectedNamespace]);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.messages
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }${filterString !== undefined ? filterString : ''}`
    )
      .then((msgRes: IPagedMessageResponse) => {
        setMessages(msgRes.items);
        setMessageTotal(msgRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    createdFilter,
    lastEvent,
    filterString,
    reportFetchError,
  ]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Messages,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Large
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setMessageHistData(makeMsgHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const msgColumnHeaders = [
    t('type'),
    t('id'),
    t('author'),
    t('transactionType'),
    t('tag'),
    t('topic'),
    t('confirmed'),
    t('state'),
  ];

  const msgRecords: IDataTableRecord[] | undefined = messages?.map((msg) => ({
    key: msg.header.id,
    columns: [
      {
        value: (
          <FFTableText
            color="primary"
            text={t(FF_MESSAGES_CATEGORY_MAP[msg?.header.type].nicename)}
          />
        ),
      },
      {
        value: (
          <HashPopover shortHash={true} address={msg?.header.id}></HashPopover>
        ),
      },
      {
        value: (
          <HashPopover
            shortHash={true}
            address={msg?.header.author}
          ></HashPopover>
        ),
      },
      {
        value: (
          <FFTableText
            color="primary"
            text={t(FF_TX_CATEGORY_MAP[msg?.header.txtype].nicename)}
          />
        ),
      },
      {
        value: msg.header.tag ? (
          <HashPopover address={msg.header.tag} />
        ) : (
          <FFTableText color="secondary" text={t('noTagInMessage')} />
        ),
      },
      {
        value: (
          <FFTableText
            color="primary"
            text={msg.header.topics ? msg.header.topics.toString() : ''}
          />
        ),
      },
      {
        value: (
          <FFTableText color="secondary" text={getFFTime(msg.confirmed)} />
        ),
      },
      {
        value: (
          <Chip
            label={msg?.state?.toLocaleUpperCase()}
            sx={{ backgroundColor: MsgStateColorMap[msg?.state] }}
          ></Chip>
        ),
      },
    ],
    onClick: () => setViewMsg(msg),
    leftBorderColor: FF_MESSAGES_CATEGORY_MAP[msg.header.type].color,
  }));

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
      <Header title={t('messages')} subtitle={t('offChain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column" spacing={2}>
          <ChartTableHeader
            title={t('allMessages')}
            filter={
              <FilterButton
                filters={activeFilters}
                setFilters={setActiveFilters}
                onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setFilterAnchor(e.currentTarget)
                }
              />
            }
          />
          <Grid item>
            <Histogram
              colors={makeColorArray(FF_MESSAGES_CATEGORY_MAP)}
              data={messageHistData}
              indexBy="timestamp"
              keys={makeKeyArray(FF_MESSAGES_CATEGORY_MAP)}
              includeLegend={true}
              emptyText={t('noMessages')}
              isEmpty={isHistogramEmpty(messageHistData ?? [])}
            />
          </Grid>
          <DataTable
            onHandleCurrPageChange={(currentPage: number) =>
              setCurrentPage(currentPage)
            }
            onHandleRowsPerPage={(rowsPerPage: number) =>
              setRowsPerPage(rowsPerPage)
            }
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={msgRecords}
            columnHeaders={msgColumnHeaders}
            paginate={true}
            emptyStateText={t('noMessagesToDisplay')}
            dataTotal={messageTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
          {/* <Grid container justifyContent={'center'} direction="column" item>
            <FFTimelineHeader
              leftHeader={t('submittedByMe')}
              rightHeader={t('receivedFromEveryone')}
            />
            <FFTimeline
              elements={timelineElements}
              emptyText={t('noTimelineEvents')}
              height={'calc(100vh - 400px)'}
            />
          </Grid> */}
        </Grid>
      </Grid>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={MessageFilters}
          addFilter={(filter: string) =>
            setActiveFilters((activeFilters) => [...activeFilters, filter])
          }
        />
      )}
      {viewMsg && (
        <MessageSlide
          message={viewMsg}
          open={!!viewMsg}
          onClose={() => {
            setViewMsg(undefined);
          }}
        />
      )}
    </>
  );
};
