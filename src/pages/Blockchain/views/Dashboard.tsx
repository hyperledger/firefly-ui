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

import { Launch } from '@mui/icons-material';
import { IconButton, Link } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadButton } from '../../../components/Buttons/DownloadButton';
import { FireFlyCard } from '../../../components/Cards/FireFlyCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { Header } from '../../../components/Header';
import { FFDashboardRowLayout } from '../../../components/Layouts/FFDashboardRowLayout';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { ApiSlide } from '../../../components/Slides/ApiSlide';
import { BlockchainEventSlide } from '../../../components/Slides/BlockchainEventSlide';
import { ListenerSlide } from '../../../components/Slides/ListenerSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  APIS_PATH,
  BucketCollectionEnum,
  BucketCountEnum,
  EVENTS_PATH,
  FF_NAV_PATHS,
  FF_Paths,
  IBlockchainEvent,
  IContractListener,
  IDataTableRecord,
  IFireflyApi,
  IFireFlyCard,
  IGenericPagedResponse,
  IMetric,
  IPagedBlockchainEventResponse,
  ISmallCard,
  LISTENERS_PATH,
} from '../../../interfaces';
import { FF_BE_CATEGORY_MAP } from '../../../interfaces/enums/blockchainEventTypes';
import { DEFAULT_PAGE_LIMITS, FFColors } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeBlockchainEventHistogram } from '../../../utils/histograms/blockchainEventHistogram';
import { hasBlockchainEvent } from '../../../utils/wsEvents';

export const BlockchainDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { setSlideSearchParam, slideID } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [isMounted, setIsMounted] = useState(false);
  // Small cards
  // Blockchain Operations
  const [blockchainOpCount, setBlockchainOpCount] = useState<number>();
  const [blockchainOpErrorCount, setBlockchainOpErrorCount] =
    useState<number>(0);
  // Blockchain Transactions
  const [blockchainTxCount, setBlockchainTxCount] = useState<number>();
  // Blockchain Events
  const [blockchainEventCount, setBlockchainEventCount] = useState<number>();
  // Contract interfaces count
  const [contractInterfacesCount, setContractInterfacesCount] =
    useState<number>();

  // Medium cards
  // Events histogram
  const [beHistData, setBeHistData] = useState<BarDatum[]>();
  // Contract apis
  const [apis, setApis] = useState<IFireflyApi[]>();
  // Contract listeners
  const [contractListeners, setContractListeners] =
    useState<IContractListener[]>();

  const [blockchainEvents, setBlockchainEvents] =
    useState<IBlockchainEvent[]>();
  const [blockchainEventsTotal, setBlockchainEventsTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[0]);

  const [isHistLoading, setIsHistLoading] = useState(false);

  const [viewApi, setViewApi] = useState<IFireflyApi>();
  const [viewListener, setViewListener] = useState<IContractListener>();
  const [viewBlockchainEvent, setViewBlockchainEvent] =
    useState<IBlockchainEvent>();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && slideID) {
      fetchCatcher(
        `${
          FF_Paths.nsPrefix
        }/${selectedNamespace}${FF_Paths.blockchainEventsById(slideID)}`
      ).then((beRes: IBlockchainEvent) => {
        isMounted && beRes && setViewBlockchainEvent(beRes);
      });
      fetchCatcher(
        `${
          FF_Paths.nsPrefix
        }/${selectedNamespace}${FF_Paths.contractListenersByNameId(slideID)}`
      ).then((clRes: IContractListener) => {
        isMounted && clRes && setViewListener(clRes);
      });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.apisByName(
          slideID
        )}`
      ).then((apiRes: IFireflyApi) => {
        isMounted && apiRes && setViewApi(apiRes);
      });
    }
  }, [slideID, isMounted]);

  const smallCards: ISmallCard[] = [
    {
      header: t('blockchainOperations'),
      errorLink: FF_NAV_PATHS.activityOpErrorPath(selectedNamespace),
      numErrors: blockchainOpErrorCount,
      data: [{ data: blockchainOpCount }],
      clickPath:
        FF_NAV_PATHS.activityOpPathOnlyBlockchainOps(selectedNamespace),
    },
    {
      header: t('blockchainTransactions'),
      data: [{ data: blockchainTxCount }],
      clickPath:
        FF_NAV_PATHS.activityTxPathOnlyBlockchainTxs(selectedNamespace),
    },
    {
      header: t('blockchainEvents'),
      data: [{ data: blockchainEventCount }],
      clickPath: FF_NAV_PATHS.blockchainEventsPath(selectedNamespace),
    },
    {
      header: t('contractInterfaces'),
      data: [{ data: contractInterfacesCount }],
      clickPath: FF_NAV_PATHS.blockchainInterfacesPath(selectedNamespace),
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const qParams = `?count=true&limit=1${dateFilter?.filterString ?? ''}`;
    const qParamsNoRange = `?count=true&limit=1`;

    isMounted &&
      dateFilter &&
      Promise.all([
        // Blockchain Operations
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&type=^blockchain`
        ),
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&error=!`
        ),
        // Blockchain Transactions
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.transactions}${qParams}&blockchainids=!`
        ),
        // Blockchain Events
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.blockchainEvents}${qParams}`
        ),
        // Contract interfaces
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.contractInterfaces}${qParamsNoRange}`
        ),
      ])
        .then(
          ([
            // Blockchain Operations
            ops,
            opsErr,
            // Blockchain Transactions
            txs,
            // Blockchain Events
            events,
            // Contract interfaces
            interfaces,
          ]: IGenericPagedResponse[] | any[]) => {
            if (isMounted) {
              // Operations
              setBlockchainOpCount(ops.total);
              setBlockchainOpErrorCount(opsErr.total);
              // Transactions
              setBlockchainTxCount(txs.total);
              // Events
              setBlockchainEventCount(events.total);
              // Interfaces
              setContractInterfacesCount(interfaces.total);
            }
          }
        )
        .catch((err) => {
          reportFetchError(err);
        });
  }, [selectedNamespace, lastRefreshTime, dateFilter, isMounted]);

  const apiColHeaders = [t('name'), t('openApi'), t('ui')];
  const apiRecords: IDataTableRecord[] | undefined = apis?.map((api) => ({
    key: api.id,
    columns: [
      {
        value: (
          <HashPopover
            address={`${FF_Paths.nsPrefix}/${selectedNamespace}/apis/${api.name}`}
            fullLength
          />
        ),
      },
      {
        value: (
          <DownloadButton
            filename={api.name}
            url={api.urls.openapi}
            isBlob={false}
            namespace={selectedNamespace}
          />
        ),
      },
      {
        value: (
          <Link
            target="_blank"
            href={api.urls.ui}
            underline="always"
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton>
              <Launch />
            </IconButton>
          </Link>
        ),
      },
    ],
    onClick: () => {
      setViewApi(api);
      setSlideSearchParam(api.name);
    },
  }));

  const clColHeaders = [t('id'), t('event'), t('topic')];
  const clRecords: IDataTableRecord[] | undefined = contractListeners?.map(
    (cl) => ({
      key: cl.id,
      columns: [
        { value: <HashPopover shortHash address={cl.id} /> },
        { value: <FFTableText color="primary" text={cl.event.name} /> },
        {
          value: cl.topic ? (
            <FFTableText color="primary" text={cl.topic} />
          ) : (
            <FFTableText color="secondary" text={t('noTopicInListener')} />
          ),
        },
      ],
      onClick: () => {
        setViewListener(cl);
        setSlideSearchParam(cl.id);
      },
    })
  );

  const mediumCards: IFireFlyCard[] = [
    {
      headerText: t('recentBlockchainEvents'),
      clickPath: EVENTS_PATH,
      component: (
        <Histogram
          height={'100%'}
          categoryMap={FF_BE_CATEGORY_MAP}
          colors={makeColorArray(FF_BE_CATEGORY_MAP)}
          data={beHistData}
          indexBy="timestamp"
          keys={makeKeyArray(FF_BE_CATEGORY_MAP)}
          includeLegend={true}
          emptyText={t('noBlockchainEvents')}
          isLoading={isHistLoading}
          isEmpty={isHistogramEmpty(beHistData ?? [])}
        />
      ),
    },
    {
      headerText: t('apis'),
      clickPath: APIS_PATH,
      component: (
        <MediumCardTable
          records={apiRecords}
          columnHeaders={apiColHeaders}
          emptyMessage={t('noApis')}
        ></MediumCardTable>
      ),
    },
    {
      headerText: t('contractListeners'),
      clickPath: LISTENERS_PATH,
      component: (
        <MediumCardTable
          records={clRecords}
          columnHeaders={clColHeaders}
          emptyMessage={t('noContractListeners')}
        ></MediumCardTable>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    if (isMounted) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.apis}?limit=25`
      )
        .then((apis: IFireflyApi[]) => {
          isMounted && setApis(apis);
        })
        .catch((err) => {
          reportFetchError(err);
        });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.contractListeners}?limit=25`
      )
        .then((listeners: IContractListener[]) => {
          isMounted && setContractListeners(listeners);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [selectedNamespace, lastRefreshTime, isMounted]);

  // Histogram
  useEffect(() => {
    setIsHistLoading(true);
    const currentTime = dayjs().unix();

    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
          BucketCollectionEnum.BlockchainEvents,
          dateFilter.filterTime,
          currentTime,
          BucketCountEnum.Small
        )}`
      )
        .then((histTypes: IMetric[]) => {
          isMounted && setBeHistData(makeBlockchainEventHistogram(histTypes));
        })
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => setIsHistLoading(false));
  }, [selectedNamespace, lastRefreshTime, dateFilter, isMounted]);

  const beColHeaders = [
    t('name'),
    t('id'),
    t('protocolID'),
    t('source'),
    t('timestamp'),
  ];
  const beRecords: IDataTableRecord[] | undefined = blockchainEvents?.map(
    (be) => ({
      key: be.id,
      columns: [
        {
          value: <FFTableText color="primary" text={be.name} />,
        },
        {
          value: <HashPopover shortHash={true} address={be.id}></HashPopover>,
        },
        {
          value: <FFTableText color="primary" text={be.protocolId} />,
        },
        {
          value: <FFTableText color="primary" text={be.source} />,
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={getFFTime(be.timestamp)}
              tooltip={getFFTime(be.timestamp, true)}
            />
          ),
        },
      ],
      leftBorderColor: FFColors.Yellow,
      onClick: () => {
        setViewBlockchainEvent(be);
        setSlideSearchParam(be.id);
      },
    })
  );

  // Recent blockchain events
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.blockchainEvents
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }`
      )
        .then((blockchainEvents: IPagedBlockchainEventResponse) => {
          if (isMounted) {
            setBlockchainEvents(blockchainEvents.items);
            setBlockchainEventsTotal(blockchainEvents.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    dateFilter,
    lastRefreshTime,
    isMounted,
  ]);

  return (
    <>
      <Header
        title={t('dashboard')}
        subtitle={t('blockchain')}
        showRefreshBtn={hasBlockchainEvent(newEvents)}
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
          header={t('recentBlockchainEvents')}
          onHandleCurrPageChange={(currentPage: number) =>
            setCurrentPage(currentPage)
          }
          onHandleRowsPerPage={(rowsPerPage: number) =>
            setRowsPerPage(rowsPerPage)
          }
          stickyHeader={true}
          minHeight="300px"
          maxHeight="calc(100vh - 800px)"
          records={beRecords}
          columnHeaders={beColHeaders}
          paginate={true}
          emptyStateText={t('noBlockchainEventsToDisplay')}
          dataTotal={blockchainEventsTotal}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          dashboardSize
          clickPath={EVENTS_PATH}
        />
      </FFPageLayout>
      {viewApi && (
        <ApiSlide
          api={viewApi}
          open={!!viewApi}
          onClose={() => {
            setViewApi(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
      {viewListener && (
        <ListenerSlide
          listener={viewListener}
          open={!!viewListener}
          onClose={() => {
            setViewListener(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
      {viewBlockchainEvent && (
        <BlockchainEventSlide
          be={viewBlockchainEvent}
          open={!!viewBlockchainEvent}
          onClose={() => {
            setViewBlockchainEvent(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
