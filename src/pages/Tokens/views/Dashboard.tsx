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
import { Chip, Grid, IconButton } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import { FireFlyCard } from '../../../components/Cards/FireFlyCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { Header } from '../../../components/Header';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { TransferSlide } from '../../../components/Slides/TransferSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_NAV_PATHS,
  FF_Paths,
  ICreatedFilter,
  IDataTableRecord,
  IFireFlyCard,
  IGenericPagedResponse,
  IMetric,
  IPagedTokenTransferResponse,
  ISmallCard,
  ITokenBalance,
  ITokenPool,
  ITokenTransfer,
  POOLS_PATH,
  TRANSFERS_PATH,
} from '../../../interfaces';
import {
  FF_EVENTS,
  FF_TRANSFER_CATEGORY_MAP,
  PoolStateColorMap,
  TransferIconMap,
} from '../../../interfaces/enums';
import {
  DEFAULT_PADDING,
  DEFAULT_PAGE_LIMITS,
  DEFAULT_SPACING,
} from '../../../theme';
import {
  fetchCatcher,
  getCreatedFilter,
  getFFTime,
  jsNumberForAddress,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeTransferHistogram } from '../../../utils/histograms/transferHistogram';
import { isEventType } from '../../../utils/wsEvents';

export const TokensDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  // Small cards
  // Tokens
  const [tokenTransfersCount, setTokenTransfersCount] = useState<number>();
  const [tokenMintCount, setTokenMintcount] = useState<number>();
  const [tokenBurnCount, setTokenBurnCount] = useState<number>();
  const [tokenErrorCount, setTokenErrorCount] = useState<number>(0);
  // Accounts
  const [tokenAccountsCount, setTokenAccountsCount] = useState<number>();
  // Pools
  const [tokenPoolCount, setTokenPoolCount] = useState<number>();
  const [tokenPoolErrorCount, setTokenPoolErrorCount] = useState<number>(0);
  // Connectors
  const [tokenConnectorCount, setTokenConnectorCount] = useState<number>();

  // Medium cards
  // Transfer types histogram
  const [transferHistData, setTransferHistData] = useState<BarDatum[]>();
  // Token accounts
  const [tokenBalances, setTokenBalances] = useState<ITokenBalance[]>();
  // Token pools
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>();
  // Token transfers
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>();
  // Token Transfer totals
  const [tokenTransferTotal, setTokenTransferTotal] = useState(0);
  // View transfer slide out
  const [viewTransfer, setViewTransfer] = useState<
    ITokenTransfer | undefined
  >();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[0]);
  // Last event tracking
  const [numNewEvents, setNumNewEvents] = useState(0);
  const [lastRefreshTime, setLastRefresh] = useState<string>(
    new Date().toISOString()
  );

  useEffect(() => {
    isMounted &&
      (isEventType(lastEvent, FF_EVENTS.TOKEN_POOL_CONFIRMED) ||
        isEventType(lastEvent, FF_EVENTS.TOKEN_TRANSFER_CONFIRMED) ||
        isEventType(lastEvent, FF_EVENTS.TOKEN_TRANSFER_FAILED)) &&
      setNumNewEvents(numNewEvents + 1);
  }, [lastEvent]);

  const refreshData = () => {
    setNumNewEvents(0);
    setLastRefresh(new Date().toString());
  };

  useEffect(() => {
    setIsMounted(true);
    setNumNewEvents(0);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const smallCards: ISmallCard[] = [
    {
      header: t('tokens'),
      numErrors: tokenErrorCount,
      data: [
        { header: t('transfers'), data: tokenTransfersCount },
        { header: t('mint'), data: tokenMintCount },
        { header: t('burn'), data: tokenBurnCount },
      ],
      clickPath: TRANSFERS_PATH,
    },
    {
      header: t('accounts'),
      numErrors: 0,
      data: [{ header: t('total'), data: tokenAccountsCount }],
      clickPath: POOLS_PATH,
    },
    {
      header: t('tokenPools'),
      numErrors: tokenPoolErrorCount,
      data: [{ header: t('total'), data: tokenPoolCount }],
      clickPath: POOLS_PATH,
    },
    {
      header: t('connectors'),
      numErrors: 0,
      data: [{ header: t('total'), data: tokenConnectorCount }],
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;

    isMounted &&
      Promise.all([
        // Tokens
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=transfer`
        ),
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=mint`
        ),
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=burn`
        ),
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&type=token_create_pool&type=token_activate_pool&type=token_transfer&status=Failed`
        ),
        // Accounts
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenAccounts}${qParams}`
        ),
        // Pools
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPools}?count=true&limit=1`
        ),
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&type=token_create_pool&type=token_activate_pool&status=Failed`
        ),
        // Connectors
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenConnectors}?count=true&limit=1`
        ),
      ])
        .then(
          ([
            // Transfers
            tokensTransfer,
            tokensMint,
            tokensBurn,
            tokenErrors,
            // Accounts
            tokenAccounts,
            // Pools
            tokenPools,
            tokenPoolErrors,
            // Connectors
            tokenConnectors,
          ]: IGenericPagedResponse[] | any[]) => {
            if (isMounted) {
              // Transfers
              setTokenTransfersCount(tokensTransfer.total);
              setTokenMintcount(tokensMint.total);
              setTokenBurnCount(tokensBurn.total);
              setTokenErrorCount(tokenErrors.total);
              // Accounts
              setTokenAccountsCount(tokenAccounts.total);
              // Pools
              setTokenPoolCount(tokenPools.total);
              setTokenPoolErrorCount(tokenPoolErrors.total);
              // Connectors
              setTokenConnectorCount(tokenConnectors.length);
            }
          }
        )
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => numNewEvents !== 0 && setNumNewEvents(0));
  }, [selectedNamespace, createdFilter, lastRefreshTime, isMounted]);

  const tokenAccountsColHeaders = [t('key'), t('poolID'), t('balance')];
  const tokenAccountRecords: IDataTableRecord[] | undefined =
    tokenBalances?.map((acct, idx) => ({
      key: idx.toString(),
      columns: [
        {
          value: <HashPopover address={acct.key} />,
        },
        {
          value: <HashPopover shortHash address={acct.pool} />,
        },
        {
          value: <FFTableText color="primary" text={acct.balance} />,
        },
      ],
      onClick: () =>
        navigate(
          FF_NAV_PATHS.tokensPoolDetailsPath(selectedNamespace, acct.pool)
        ),
    }));

  const tokenPoolColHeaders = [t(''), t('name'), t('standard'), t('state')];
  const tokenPoolRecords: IDataTableRecord[] | undefined = tokenPools?.map(
    (pool) => ({
      key: pool.id,
      columns: [
        {
          value: (
            <Jazzicon diameter={20} seed={jsNumberForAddress(pool.name)} />
          ),
        },
        {
          value: (
            <FFTableText
              isComponent
              color="primary"
              text={
                pool.name.length > 10 ? (
                  <HashPopover shortHash address={pool.name} />
                ) : (
                  pool.name
                )
              }
            />
          ),
        },
        { value: <FFTableText color="primary" text={pool.standard} /> },
        {
          value: pool.state && (
            <Chip
              label={pool.state.toLocaleUpperCase()}
              sx={{ backgroundColor: PoolStateColorMap[pool.state] }}
            />
          ),
        },
      ],
      onClick: () =>
        navigate(
          FF_NAV_PATHS.tokensPoolDetailsPath(selectedNamespace, pool.id)
        ),
    })
  );

  const mediumCards: IFireFlyCard[] = [
    {
      headerText: t('tokenTransferTypes'),
      headerComponent: (
        <IconButton onClick={() => navigate(TRANSFERS_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <Histogram
          height={'100%'}
          colors={makeColorArray(FF_TRANSFER_CATEGORY_MAP)}
          data={transferHistData}
          indexBy="timestamp"
          keys={makeKeyArray(FF_TRANSFER_CATEGORY_MAP)}
          includeLegend={true}
          emptyText={t('noTransfers')}
          isEmpty={isHistogramEmpty(transferHistData ?? [])}
        />
      ),
    },
    {
      headerText: t('accountBalances'),
      headerComponent: (
        <IconButton onClick={() => navigate(POOLS_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <MediumCardTable
          records={tokenAccountRecords}
          columnHeaders={tokenAccountsColHeaders}
          emptyMessage={t('noTokenAccounts')}
          stickyHeader={true}
        ></MediumCardTable>
      ),
    },
    {
      headerText: t('tokenPools'),
      headerComponent: (
        <IconButton onClick={() => navigate(POOLS_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <MediumCardTable
          records={tokenPoolRecords}
          columnHeaders={tokenPoolColHeaders}
          emptyMessage={t('noTokenPools')}
          stickyHeader={true}
        ></MediumCardTable>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    if (isMounted) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
          BucketCollectionEnum.TokenTransfers,
          createdFilterObject.filterTime,
          currentTime,
          BucketCountEnum.Small
        )}`
      )
        .then((histTypes: IMetric[]) => {
          isMounted && setTransferHistData(makeTransferHistogram(histTypes));
        })
        .catch((err) => {
          setTransferHistData([]);
          reportFetchError(err);
        });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPools}`
      )
        .then((pools: ITokenPool[]) => {
          isMounted && setTokenPools(pools);
        })
        .catch((err) => {
          reportFetchError(err);
        });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenBalances}`
      )
        .then((balances: ITokenBalance[]) => {
          isMounted && setTokenBalances(balances);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [selectedNamespace, lastRefreshTime, createdFilter, isMounted]);

  const tokenTransferColHeaders = [
    t('type'),
    t('from'),
    t('to'),
    t('amount'),
    t('blockchainEvent'),
    t('author'),
    t('timestamp'),
  ];
  const tokenTransferRecords: IDataTableRecord[] | undefined =
    tokenTransfers?.map((transfer) => ({
      key: transfer.localId,
      columns: [
        {
          value: (
            <FFTableText
              color="primary"
              text={t(FF_TRANSFER_CATEGORY_MAP[transfer.type]?.nicename)}
              icon={TransferIconMap[transfer.type]}
            />
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.from ?? t('nullAddress')}
            ></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.to ?? t('nullAddress')}
            ></HashPopover>
          ),
        },
        {
          value: <FFTableText color="primary" text={transfer.amount} />,
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.blockchainEvent}
            ></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover shortHash={true} address={transfer.key}></HashPopover>
          ),
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(transfer.created)} />
          ),
        },
      ],
      onClick: () => setViewTransfer(transfer),
      leftBorderColor: FF_TRANSFER_CATEGORY_MAP[transfer.type]?.color,
    }));

  // Recent token transfers
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenTransfers
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          createdFilterObject.filterString
        }`
      )
        .then((tokenTransfers: IPagedTokenTransferResponse) => {
          if (isMounted) {
            setTokenTransfers(tokenTransfers.items);
            setTokenTransferTotal(tokenTransfers.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [
    rowsPerPage,
    currentPage,
    lastRefreshTime,
    selectedNamespace,
    createdFilter,
    isMounted,
  ]);

  return (
    <>
      <Header
        title={t('dashboard')}
        subtitle={t('tokens')}
        onRefresh={refreshData}
        numNewEvents={numNewEvents}
      ></Header>
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
                  <FireFlyCard card={card} position="flex-start" />
                </Grid>
              );
            })}
          </Grid>
          <DataTable
            header={t('recentTokenTransfers')}
            headerBtn={
              <IconButton onClick={() => navigate(TRANSFERS_PATH)}>
                <ArrowForwardIcon />
              </IconButton>
            }
            onHandleCurrPageChange={(currentPage: number) =>
              setCurrentPage(currentPage)
            }
            onHandleRowsPerPage={(rowsPerPage: number) =>
              setRowsPerPage(rowsPerPage)
            }
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 800px)"
            records={tokenTransferRecords}
            columnHeaders={tokenTransferColHeaders}
            paginate={true}
            emptyStateText={t('noTokenTransfersToDisplay')}
            dataTotal={tokenTransferTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
      {viewTransfer && (
        <TransferSlide
          transfer={viewTransfer}
          open={!!viewTransfer}
          onClose={() => {
            setViewTransfer(undefined);
          }}
        />
      )}
    </>
  );
};
