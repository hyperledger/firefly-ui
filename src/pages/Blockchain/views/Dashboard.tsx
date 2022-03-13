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
import { Grid, IconButton, TablePagination, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MediumCard } from '../../../components/Cards/MediumCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  EVENTS_PATH,
  FF_NAV_PATHS,
  FF_Paths,
  IBlockchainEvent,
  IContractInterface,
  IContractListener,
  ICreatedFilter,
  IGenericPagedResponse,
  IMediumCard,
  IMetric,
  INTERFACES_PATH,
  IPagedBlockchainEventResponse,
  ISmallCard,
  LISTENERS_PATH,
} from '../../../interfaces';
import {
  BlockchainEventCategoryEnum,
  FF_BE_CATEGORY_MAP,
} from '../../../interfaces/enums/blockchainEventTypes';
import { DEFAULT_PADDING, DEFAULT_SPACING, FFColors } from '../../../theme';
import { fetchCatcher } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeBlockchainEventHistogram } from '../../../utils/histograms/blockchainEventHistogram';

const PAGE_LIMITS = [5, 10];

export const BlockchainDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();

  // Small cards
  // Blockchain Operations
  const [blockchainOpCount, setBlockchainOpCount] = useState<number>();
  const [blockchainOpErrorCount, setBlockchainOpErrorCount] =
    useState<number>(0);
  // Blockchain Transactions
  const [blockchainTxCount, setBlockchainTxCount] = useState<number>();
  const [blockchainTxErrorCount, setBlockchainTxErrorCount] =
    useState<number>(0);
  // Blockchain Events
  const [blockchainEventCount, setBlockchainEventCount] = useState<number>();
  const [blockchainEventErrorCount, setBlockchainEventErrorCount] =
    useState<number>(0);
  // Contract interfaces count
  const [contractInterfacesCount, setContractInterfacesCount] =
    useState<number>();
  const [contractInterfacesErrorCount, setContractInterfacesErrorCount] =
    useState<number>(0);

  // Medium cards
  // Events histogram
  const [beHistData, setBeHistData] = useState<BarDatum[]>();
  // Contract interfaces
  const [contractInterfaces, setContractInterfaces] =
    useState<IContractInterface[]>();
  // Contract listeners
  const [contractListeners, setContractListeners] =
    useState<IContractListener[]>();
  // View Blockchain Events
  const [viewBlockchainEvent, setViewBlockchainEvent] =
    useState<IBlockchainEvent>();

  const [blockchainEvents, setBlockchainEvents] =
    useState<IBlockchainEvent[]>();
  const [blockchainEventsTotal, setBlockchainEventsTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (
      newPage > currentPage &&
      rowsPerPage * (currentPage + 1) >= blockchainEventsTotal
    ) {
      return;
    }
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPage(0);
    setRowsPerPage(+event.target.value);
  };

  const pagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={currentPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      sx={{ color: 'text.secondary' }}
    />
  );

  const smallCards: ISmallCard[] = [
    {
      header: t('blockchainOperations'),
      numErrors: blockchainOpErrorCount,
      data: [{ data: blockchainOpCount }],
      clickPath: FF_NAV_PATHS.activityOpPath(selectedNamespace),
    },
    {
      header: t('blockchainTransactions'),
      numErrors: blockchainTxErrorCount,
      data: [{ data: blockchainTxCount }],
      clickPath: FF_NAV_PATHS.activityTxPath(selectedNamespace),
    },
    {
      header: t('blockchainEvents'),
      numErrors: blockchainEventErrorCount,
      data: [{ data: blockchainEventCount }],
      clickPath: FF_NAV_PATHS.blockchainEventsPath(selectedNamespace),
    },
    {
      header: t('contractInterfaces'),
      numErrors: contractInterfacesErrorCount,
      data: [{ data: contractInterfacesCount }],
      clickPath: FF_NAV_PATHS.blockchainInterfacesPath(selectedNamespace),
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;
    const qParamsNoRange = `?count=true&limit=1`;

    Promise.all([
      // Blockchain Operations
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}`
      ),
      // Blockchain Transactions
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.transactions}${qParams}`
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
          // Blockchain Transactions
          txs,
          // Blockchain Events
          events,
          // Contract interfaces
          interfaces,
        ]: IGenericPagedResponse[] | any[]) => {
          // Operations
          setBlockchainOpCount(ops.total);
          // Transactions
          setBlockchainTxCount(txs.total);
          // Events
          setBlockchainEventCount(events.total);
          // Interfaces
          setContractInterfacesCount(interfaces.total);
        }
      )
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const ciColHeaders = [t('name'), t('version'), t('interfaceID')];
  const ciRecords: IDataTableRecord[] | undefined = contractInterfaces?.map(
    (ci) => ({
      key: ci.name,
      columns: [
        {
          value: <Typography>{ci.name}</Typography>,
        },
        {
          value: <Typography>{ci.version}</Typography>,
        },
        {
          value: <HashPopover shortHash address={ci.id} />,
        },
      ],
      onClick: () => navigate(INTERFACES_PATH),
    })
  );

  const clColHeaders = [t('name'), t('eventName')];
  const clRecords: IDataTableRecord[] | undefined = contractListeners?.map(
    (cl) => ({
      key: cl.name,
      columns: [
        { value: <HashPopover shortHash address={cl.name} /> },
        { value: <Typography>{cl.event.name}</Typography> },
      ],
      onClick: () => navigate(LISTENERS_PATH),
    })
  );

  const mediumCards: IMediumCard[] = [
    {
      headerText: t('recentBlockchainEvents'),
      headerComponent: (
        <IconButton onClick={() => navigate(EVENTS_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <Histogram
          colors={makeColorArray(FF_BE_CATEGORY_MAP)}
          data={beHistData}
          indexBy="timestamp"
          keys={makeKeyArray(FF_BE_CATEGORY_MAP)}
          includeLegend={true}
          emptyText={t('noBlockchainEvents')}
          isEmpty={isHistogramEmpty(
            beHistData ?? [],
            Object.keys(BlockchainEventCategoryEnum)
          )}
        ></Histogram>
      ),
    },
    {
      headerText: t('contractInterfaces'),
      headerComponent: (
        <IconButton onClick={() => navigate(INTERFACES_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <MediumCardTable
          records={ciRecords}
          columnHeaders={ciColHeaders}
          emptyMessage={t('noContractInterfaces')}
          stickyHeader={true}
        ></MediumCardTable>
      ),
    },
    {
      headerText: t('contractListeners'),
      headerComponent: (
        <IconButton onClick={() => navigate(LISTENERS_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <MediumCardTable
          records={clRecords}
          columnHeaders={clColHeaders}
          emptyMessage={t('noContractListeners')}
          stickyHeader={true}
        ></MediumCardTable>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.contractInterfaces}?limit=5`
    )
      .then((interfaces: IContractInterface[]) => {
        setContractInterfaces(interfaces);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.contractListeners}?limit=5`
    )
      .then((listeners: IContractListener[]) => {
        setContractListeners(listeners);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.BlockchainEvents,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Small
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setBeHistData(makeBlockchainEventHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

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
          value: <Typography>{be.name}</Typography>,
        },
        {
          value: <HashPopover shortHash={true} address={be.id}></HashPopover>,
        },
        {
          value: <Typography>{be.protocolId}</Typography>,
        },
        {
          value: <Typography>{be.source}</Typography>,
        },
        { value: dayjs(be.timestamp).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => setViewBlockchainEvent(be),
      leftBorderColor: FFColors.Yellow,
    })
  );

  // Recent blockchain events
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.blockchainEvents
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((blockchainEvents: IPagedBlockchainEventResponse) => {
        setBlockchainEvents(blockchainEvents.items);
        setBlockchainEventsTotal(blockchainEvents.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  return (
    <>
      <Header title={t('dashboard')} subtitle={t('blockchain')}></Header>
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
                  <SmallCard card={card} />
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
                  <MediumCard card={card} position="flex-start" />
                </Grid>
              );
            })}
          </Grid>
          {/* Blockchain Events */}
          <DataTable
            header={t('recentBlockchainEvents')}
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={beRecords}
            columnHeaders={beColHeaders}
            {...{ pagination }}
            emptyStateText={t('noBlockchainEvents')}
            headerBtn={
              <IconButton onClick={() => navigate(EVENTS_PATH)}>
                <ArrowForwardIcon />
              </IconButton>
            }
          />
        </Grid>
      </Grid>
    </>
  );
};
