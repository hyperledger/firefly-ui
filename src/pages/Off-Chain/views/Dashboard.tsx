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

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';
import { Chip, Grid, IconButton, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FireFlyCard } from '../../../components/Cards/FireFlyCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { Header } from '../../../components/Header';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { MessageSlide } from '../../../components/Slides/MessageSlide';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  DATATYPES_PATH,
  DATA_PATH,
  FF_MESSAGES_CATEGORY_MAP,
  FF_Paths,
  ICreatedFilter,
  IData,
  IDataTableRecord,
  IDatatype,
  IFireFlyCard,
  IGenericPagedResponse,
  IMessage,
  IMetric,
  IPagedMessageResponse,
  ISmallCard,
  MESSAGES_PATH,
  MsgStateColorMap,
} from '../../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import {
  DEFAULT_PADDING,
  DEFAULT_PAGE_LIMITS,
  DEFAULT_SPACING,
} from '../../../theme';
import {
  downloadBlobFile,
  fetchCatcher,
  getCreatedFilter,
  makeMsgHistogram,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

export const OffChainDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();

  // Small cards
  // Message count
  const [msgCount, setMsgCount] = useState<number>();
  // Data count
  const [dataCount, setDataCount] = useState<number>();
  // Datatypes
  const [datatypesCount, setDatatypesCount] = useState<number>();

  // Medium cards
  // Messages histogram
  const [messageHistData, setMessageHistData] = useState<BarDatum[]>();
  // Data
  const [data, setData] = useState<IData[]>();
  // Datatypes
  const [datatypes, setDatatypes] = useState<IDatatype[]>();

  // Table
  const [messages, setMessages] = useState<IMessage[]>();
  // Message totals
  const [messageTotal, setMessageTotal] = useState(0);
  // View message slide out
  const [viewMsg, setViewMsg] = useState<IMessage | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[0]);

  const smallCards: ISmallCard[] = [
    {
      header: t('messages'),
      data: [{ data: msgCount }],
      clickPath: `${MESSAGES_PATH}`,
    },
    {
      header: t('data'),
      data: [{ data: dataCount }],
      clickPath: `${DATA_PATH}`,
    },
    {
      header: t('totalDatatypes'),
      data: [{ data: datatypesCount }],
      clickPath: DATATYPES_PATH,
    },
    {
      header: t('totalFileSize'),
      data: [{ data: 0 }],
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;
    const qParamsNoRange = `?count=true&limit=1`;

    Promise.all([
      // Messages
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messages}${qParams}`
      ),
      // Data
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.data}${qParams}`
      ),
      // Datatypes
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.datatypes}${qParamsNoRange}`
      ),
    ])
      .then(
        ([
          // Msgs
          msgs,
          // Data
          data,
          // Datatypes
          datatypes,
        ]: IGenericPagedResponse[] | any[]) => {
          // Data
          setMsgCount(msgs.total);
          // Data Count
          setDataCount(data.total);
          // Datatypes
          setDatatypesCount(datatypes.total);
        }
      )
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const dataHeaders = [t('nameOrID'), t('created'), t('download')];
  const dataRecords: IDataTableRecord[] | undefined = data?.map((data) => ({
    key: data.id,
    columns: [
      {
        value: data.blob?.name ? (
          <HashPopover shortHash address={data.blob.name} />
        ) : (
          <HashPopover shortHash address={data.id} />
        ),
      },
      { value: dayjs(data.created).format('MM/DD/YYYY h:mm A') },
      {
        value: data.blob && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              downloadBlobFile(data.id, data.blob?.name);
            }}
          >
            <DownloadIcon />
          </IconButton>
        ),
      },
    ],
    onClick: () => navigate(DATA_PATH),
  }));

  const dtHeaders = [t('id'), t('version'), t('created')];
  const dtRecords: IDataTableRecord[] | undefined = datatypes?.map((dt) => ({
    key: dt.id,
    columns: [
      { value: <HashPopover shortHash address={dt.id} /> },
      { value: <Typography>{dt.version}</Typography> },
      { value: dayjs(dt.created).format('MM/DD/YYYY h:mm A') },
    ],
    onClick: () => navigate(DATATYPES_PATH),
  }));

  const mediumCards: IFireFlyCard[] = [
    {
      headerText: t('recentMessages'),
      headerComponent: (
        <IconButton onClick={() => navigate(MESSAGES_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <Histogram
          height={'100%'}
          colors={makeColorArray(FF_MESSAGES_CATEGORY_MAP)}
          data={messageHistData}
          indexBy="timestamp"
          emptyText={t('noMessages')}
          isEmpty={isHistogramEmpty(messageHistData ?? [])}
          keys={makeKeyArray(FF_MESSAGES_CATEGORY_MAP)}
          includeLegend={true}
        />
      ),
    },
    {
      headerText: t('recentData'),
      headerComponent: (
        <IconButton onClick={() => navigate(DATA_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <MediumCardTable
          records={dataRecords}
          columnHeaders={dataHeaders}
          emptyMessage={t('noRecentData')}
          stickyHeader={true}
        ></MediumCardTable>
      ),
    },
    {
      headerText: t('datatypes'),
      headerComponent: (
        <IconButton onClick={() => navigate(DATATYPES_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <MediumCardTable
          records={dtRecords}
          columnHeaders={dtHeaders}
          emptyMessage={t('noDatatypes')}
          stickyHeader={true}
        ></MediumCardTable>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?limit=4${createdFilterObject.filterString}`;
    const qParamsNoRange = `?limit=4`;
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Messages,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Small
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setMessageHistData(makeMsgHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Data
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.data}${qParams}`
    )
      .then((data: IData[]) => {
        setData(data);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Datatypes
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.datatypes}${qParamsNoRange}`
    )
      .then((datatypes: IDatatype[]) => {
        setDatatypes(datatypes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

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
            label={msg?.state?.toLocaleUpperCase()}
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
      <Header title={t('dashboard')} subtitle={t('offChain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          {/* Small Cards */}
          <Grid
            spacing={DEFAULT_SPACING}
            container
            item
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {smallCards.map((card) => {
              return (
                <Grid
                  key={card.header}
                  xs={DEFAULT_PADDING}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  container
                  item
                >
                  <SmallCard key={card.header} card={card} />
                </Grid>
              );
            })}
          </Grid>
          {/* Medium Cards */}
          <Grid
            spacing={DEFAULT_SPACING}
            container
            justifyContent="center"
            alignItems="flex-start"
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {mediumCards.map((card) => {
              return (
                <Grid
                  key={card.headerText}
                  direction="column"
                  justifyContent="center"
                  container
                  item
                  xs={4}
                >
                  <FireFlyCard card={card} position="flex-start" />
                </Grid>
              );
            })}
          </Grid>
          <DataTable
            header={t('recentMessages')}
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
            headerBtn={
              <IconButton onClick={() => navigate(MESSAGES_PATH)}>
                <ArrowForwardIcon />
              </IconButton>
            }
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
