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

import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadButton } from '../../../components/Buttons/DownloadButton';
import { FireFlyCard } from '../../../components/Cards/FireFlyCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { MsgStatusChip } from '../../../components/Chips/MsgStatusChip';
import { Header } from '../../../components/Header';
import { FFDashboardRowLayout } from '../../../components/Layouts/FFDashboardRowLayout';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataSlide } from '../../../components/Slides/DataSlide';
import { DatatypeSlide } from '../../../components/Slides/DatatypeSlide';
import { MessageSlide } from '../../../components/Slides/MessageSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  DATATYPES_PATH,
  DATA_PATH,
  FF_MESSAGES_CATEGORY_MAP,
  FF_Paths,
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
} from '../../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime, makeMsgHistogram } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { hasOffchainEvent } from '../../../utils/wsEvents';

export const OffChainDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [isMounted, setIsMounted] = useState(false);
  // Small cards
  // Message count
  const [msgCount, setMsgCount] = useState<number>();
  // Data count
  const [dataCount, setDataCount] = useState<number>();
  // Datatypes
  const [datatypesCount, setDatatypesCount] = useState<number>();
  // Blobs
  const [blobCount, setBlobCount] = useState<number>();

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
  const [viewData, setViewData] = useState<IData | undefined>();
  const [viewDatatype, setViewDatatype] = useState<IDatatype | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[0]);

  const [isHistLoading, setIsHistLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && slideID) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messagesById(
          slideID
        )}`
      ).then((messageRes: IMessage) => {
        setViewMsg(messageRes);
      });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.dataById(slideID)}`
      ).then((dataRes: IData) => {
        setViewData(dataRes);
      });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.datatypes}?id=${slideID}`
      ).then((dtRes: IDatatype[]) => {
        dtRes.length === 1 && setViewDatatype(dtRes[0]);
      });
    }
  }, [slideID, isMounted]);

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
      header: t('blobs'),
      data: [{ data: blobCount }],
      clickPath: `${DATA_PATH}?filters=blob.hash=!=`,
    },
    {
      header: t('totalDatatypes'),
      data: [{ data: datatypesCount }],
      clickPath: DATATYPES_PATH,
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const qParams = `?count=true&limit=1${dateFilter?.filterString ?? ''}`;
    const qParamsNoRange = `?count=true&limit=1`;

    isMounted &&
      dateFilter &&
      Promise.all([
        // Messages
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messages}${qParams}`
        ),
        // Data
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.data}${qParams}`
        ),
        // Blobs
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.data}${qParams}&blob.hash=!?`
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
            // Blobs
            blobs,
            // Datatypes
            datatypes,
          ]: IGenericPagedResponse[] | any[]) => {
            if (isMounted) {
              // Data
              setMsgCount(msgs.total);
              // Data Count
              setDataCount(data.total);
              // Blob count
              setBlobCount(blobs.total);
              // Datatypes
              setDatatypesCount(datatypes.total);
            }
          }
        )
        .catch((err) => {
          reportFetchError(err);
        });
  }, [selectedNamespace, dateFilter, lastRefreshTime, isMounted]);

  const dataHeaders = [t('nameOrID'), t('created'), t('blob')];
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
      {
        value: (
          <FFTableText
            color="secondary"
            text={getFFTime(data.created)}
            tooltip={getFFTime(data.created, true)}
          />
        ),
      },
      {
        value: data.blob ? (
          <DownloadButton
            isBlob
            url={data.id}
            filename={data.blob?.name}
            namespace={selectedNamespace}
          />
        ) : (
          <FFTableText color="secondary" text={t('noBlobInData')} />
        ),
      },
    ],
    onClick: () => {
      setViewData(data);
      setSlideSearchParam(data.id);
    },
  }));

  const dtHeaders = [t('name'), t('version'), t('created')];
  const dtRecords: IDataTableRecord[] | undefined = datatypes?.map((dt) => ({
    key: dt.id,
    columns: [
      { value: <HashPopover shortHash address={dt.name} /> },
      {
        value: <FFTableText color="primary" text={dt.version} />,
      },
      {
        value: (
          <FFTableText
            color="secondary"
            text={getFFTime(dt.created)}
            tooltip={getFFTime(dt.created, true)}
          />
        ),
      },
    ],
    onClick: () => {
      setViewDatatype(dt);
      setSlideSearchParam(dt.id);
    },
  }));

  const mediumCards: IFireFlyCard[] = [
    {
      headerText: t('recentMessages'),
      clickPath: MESSAGES_PATH,
      component: (
        <Histogram
          height={'100%'}
          categoryMap={FF_MESSAGES_CATEGORY_MAP}
          colors={makeColorArray(FF_MESSAGES_CATEGORY_MAP)}
          data={messageHistData}
          indexBy="timestamp"
          emptyText={t('noMessages')}
          isEmpty={isHistogramEmpty(messageHistData ?? [])}
          keys={makeKeyArray(FF_MESSAGES_CATEGORY_MAP)}
          includeLegend={true}
          isLoading={isHistLoading}
        />
      ),
    },
    {
      headerText: t('recentData'),
      clickPath: DATA_PATH,
      component: (
        <MediumCardTable
          records={dataRecords}
          columnHeaders={dataHeaders}
          emptyMessage={t('noRecentData')}
        ></MediumCardTable>
      ),
    },
    {
      headerText: t('datatypes'),
      clickPath: DATATYPES_PATH,
      component: (
        <MediumCardTable
          records={dtRecords}
          columnHeaders={dtHeaders}
          emptyMessage={t('noDatatypes')}
        ></MediumCardTable>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    setIsHistLoading(true);
    const currentTime = dayjs().unix();
    const qParams = `?limit=25${dateFilter?.filterString ?? ''}`;
    const qParamsNoRange = `?limit=25`;
    if (isMounted && dateFilter) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
          BucketCollectionEnum.Messages,
          dateFilter.filterTime,
          currentTime,
          BucketCountEnum.Small
        )}`
      )
        .then((histTypes: IMetric[]) => {
          isMounted && setMessageHistData(makeMsgHistogram(histTypes));
        })
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => setIsHistLoading(false));
      // Data
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.data}${qParams}`
      )
        .then((data: IData[]) => {
          isMounted && setData(data);
        })
        .catch((err) => {
          reportFetchError(err);
        });
      // Datatypes
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.datatypes}${qParamsNoRange}`
      )
        .then((datatypes: IDatatype[]) => {
          isMounted && setDatatypes(datatypes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [selectedNamespace, dateFilter, lastRefreshTime, isMounted]);

  // Messages
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.messages
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }`
      )
        .then((msgRes: IPagedMessageResponse) => {
          if (isMounted) {
            setMessages(msgRes.items);
            setMessageTotal(msgRes.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [
    rowsPerPage,
    dateFilter,
    currentPage,
    lastRefreshTime,
    selectedNamespace,
    isMounted,
  ]);

  const msgColumnHeaders = [
    t('type'),
    t('id'),
    t('author'),
    t('transactionType'),
    t('tag'),
    t('topic'),
    t('created'),
    t('state'),
  ];

  const msgRecords: IDataTableRecord[] | undefined = messages?.map((msg) => ({
    key: msg.header.id,
    columns: [
      {
        value: (
          <FFTableText
            color="primary"
            text={t(FF_MESSAGES_CATEGORY_MAP[msg?.header.type]?.nicename)}
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
            text={t(FF_TX_CATEGORY_MAP[msg?.header.txtype]?.nicename)}
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
        value: msg.header.topics ? (
          <HashPopover shortHash address={msg.header.topics.toString()} />
        ) : (
          <FFTableText color="secondary" text={t('noTopicsInMessage')} />
        ),
      },
      {
        value: (
          <FFTableText
            color="secondary"
            text={getFFTime(msg.confirmed)}
            tooltip={getFFTime(msg.confirmed, true)}
          />
        ),
      },
      {
        value: <MsgStatusChip msg={msg} />,
      },
    ],
    onClick: () => {
      setViewMsg(msg);
      setSlideSearchParam(msg.header.id);
    },
    leftBorderColor: FF_MESSAGES_CATEGORY_MAP[msg.header.type]?.color,
  }));

  return (
    <>
      <Header
        title={t('dashboard')}
        subtitle={t('offChain')}
        showRefreshBtn={hasOffchainEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <FFPageLayout>
        {/* Small Cards */}
        <FFDashboardRowLayout>
          {smallCards.map((cardData) => {
            return <SmallCard cardData={cardData} key={cardData.header} />;
          })}
        </FFDashboardRowLayout>
        {/* Medium Cards */}
        <FFDashboardRowLayout>
          {mediumCards.map((cardData) => {
            return (
              <FireFlyCard
                size="medium"
                key={cardData.headerText}
                cardData={cardData}
              />
            );
          })}
        </FFDashboardRowLayout>
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
          maxHeight="calc(100vh - 800px)"
          records={msgRecords}
          columnHeaders={msgColumnHeaders}
          paginate={true}
          emptyStateText={t('noMessagesToDisplay')}
          dataTotal={messageTotal}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          dashboardSize
          clickPath={MESSAGES_PATH}
        />
      </FFPageLayout>
      {viewData && (
        <DataSlide
          data={viewData}
          open={!!viewData}
          onClose={() => {
            setViewData(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
      {viewDatatype && (
        <DatatypeSlide
          dt={viewDatatype}
          open={!!viewDatatype}
          onClose={() => {
            setViewDatatype(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
      {viewMsg && (
        <MessageSlide
          message={viewMsg}
          open={!!viewMsg}
          onClose={() => {
            setViewMsg(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
