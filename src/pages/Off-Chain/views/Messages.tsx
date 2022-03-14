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

import { Button, Chip, Grid, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { MessageSlide } from '../../../components/Slides/MessageSlide';
import { DataTable } from '../../../components/Tables/Table';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  ICreatedFilter,
  IMessage,
  IMetric,
  IPagedMessageResponse,
} from '../../../interfaces';
import {
  FF_MESSAGES_CATEGORY_MAP,
  MsgCategoryEnum,
  MsgStateColorMap,
} from '../../../interfaces/enums';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import {
  DEFAULT_HIST_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_PAGE_LIMITS,
} from '../../../theme';
import { fetchCatcher, makeMsgHistogram } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

export const OffChainMessages: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Messages
  const [messages, setMessages] = useState<IMessage[]>();
  // Message totals
  const [messageTotal, setMessageTotal] = useState(0);
  // Messages histogram
  const [messageHistData, setMessageHistData] = useState<BarDatum[]>();
  // View message slide out
  const [viewMsg, setViewMsg] = useState<IMessage | undefined>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Messages
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.messages
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((msgRes: IPagedMessageResponse) => {
        setMessages(msgRes.items);
        setMessageTotal(msgRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

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
          <Typography>
            {t(FF_MESSAGES_CATEGORY_MAP[msg?.header.type].nicename)}
          </Typography>
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
          <Typography>
            {t(FF_TX_CATEGORY_MAP[msg?.header.txtype].nicename)}
          </Typography>
        ),
      },
      {
        value: <Typography>{msg.header.tag ? msg.header.tag : ''}</Typography>,
      },
      {
        value: (
          <Typography>
            {msg.header.topics ? msg.header.topics.toString() : ''}
          </Typography>
        ),
      },
      { value: dayjs(msg?.confirmed).format('MM/DD/YYYY h:mm A') },
      {
        value: (
          <Chip
            label={msg?.state.toLocaleUpperCase()}
            sx={{ backgroundColor: MsgStateColorMap[msg?.state] }}
          ></Chip>
        ),
      },
    ],
    onClick: () => setViewMsg(msg),
    leftBorderColor: FF_MESSAGES_CATEGORY_MAP[msg.header.type].color,
  }));

  return (
    <>
      <Header title={t('messages')} subtitle={t('offChain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allMessages')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <Histogram
            height={DEFAULT_HIST_HEIGHT}
            colors={makeColorArray(FF_MESSAGES_CATEGORY_MAP)}
            data={messageHistData}
            indexBy="timestamp"
            keys={makeKeyArray(FF_MESSAGES_CATEGORY_MAP)}
            includeLegend={true}
            emptyText={t('noMessages')}
            isEmpty={isHistogramEmpty(
              messageHistData ?? [],
              Object.keys(MsgCategoryEnum)
            )}
          />
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
        </Grid>
      </Grid>
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
