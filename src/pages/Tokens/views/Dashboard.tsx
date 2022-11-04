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
import Jazzicon from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import { FireFlyCard } from '../../../components/Cards/FireFlyCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { Header } from '../../../components/Header';
import { FFDashboardRowLayout } from '../../../components/Layouts/FFDashboardRowLayout';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { BalanceSlide } from '../../../components/Slides/BalanceSlide';
import { TransferSlide } from '../../../components/Slides/TransferSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { PoolContext } from '../../../contexts/PoolContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  APPROVALS_PATH,
  BALANCES_PATH,
  BucketCollectionEnum,
  BucketCountEnum,
  FF_NAV_PATHS,
  FF_Paths,
  IDataTableRecord,
  IFireFlyCard,
  IGenericPagedResponse,
  IMetric,
  IPagedTokenTransferResponse,
  ISmallCard,
  ITokenBalance,
  ITokenBalanceWithPool,
  ITokenPool,
  ITokenTransfer,
  ITokenTransferWithPool,
  POOLS_PATH,
  TRANSFERS_PATH,
} from '../../../interfaces';
import {
  FF_TRANSFER_CATEGORY_MAP,
  TransferIconMap,
} from '../../../interfaces/enums';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import {
  addDecToAmount,
  fetchCatcher,
  fetchPoolObjectFromBalance,
  fetchPoolObjectFromTransfer,
  getBalanceTooltip,
  getFFTime,
  jsNumberForAddress,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeTransferHistogram } from '../../../utils/histograms/transferHistogram';
import { hasTransferEvent } from '../../../utils/wsEvents';
import { KEY_POOL_DELIM } from './Balances';

export const TokensDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { poolCache, setPoolCache } = useContext(PoolContext);
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  // Small cards
  // Tokens
  const [tokenTransfersCount, setTokenTransfersCount] = useState<number>();
  const [tokenMintCount, setTokenMintcount] = useState<number>();
  const [tokenBurnCount, setTokenBurnCount] = useState<number>();
  const [tokenErrorCount, setTokenErrorCount] = useState<number>(0);
  // Approvals
  const [tokenApprovalCount, setTokenApprovalCount] = useState<number>();
  // Pools
  const [tokenPoolCount, setTokenPoolCount] = useState<number>();
  const [tokenPoolErrorCount, setTokenPoolErrorCount] = useState<number>(0);
  // Connectors
  const [tokenConnectorCount, setTokenConnectorCount] = useState<number>();

  // Medium cards
  // Transfer types histogram
  const [transferHistData, setTransferHistData] = useState<BarDatum[]>();
  // Token accounts
  const [tokenBalances, setTokenBalances] = useState<ITokenBalanceWithPool[]>();
  // Token pools
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>();
  // Token transfers
  const [tokenTransfers, setTokenTransfers] =
    useState<ITokenTransferWithPool[]>();
  // Token Transfer totals
  const [tokenTransferTotal, setTokenTransferTotal] = useState(0);
  // View transfer slide out
  const [viewTransfer, setViewTransfer] = useState<
    ITokenTransferWithPool | undefined
  >();
  const [viewBalance, setViewBalance] = useState<ITokenBalanceWithPool>();
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
      // Expected structure: <key>||<poolID>
      const keyPoolArray = slideID.split(KEY_POOL_DELIM);
      if (keyPoolArray.length !== 2) {
        fetchCatcher(
          `${
            FF_Paths.nsPrefix
          }/${selectedNamespace}${FF_Paths.tokenTransferById(slideID)}`
        ).then(async (transferRes: ITokenTransfer) => {
          if (transferRes) {
            const transferWithPool = await fetchPoolObjectFromTransfer(
              transferRes,
              selectedNamespace,
              poolCache,
              setPoolCache
            );
            isMounted && setViewTransfer(transferWithPool);
          }
        });
      } else {
        fetchCatcher(
          `${
            FF_Paths.nsPrefix
          }/${selectedNamespace}${FF_Paths.tokenBalancesByKeyPool(
            keyPoolArray[0],
            keyPoolArray[1]
          )}`
        )
          .then(async (balanceRes: ITokenBalance[]) => {
            if (isMounted && balanceRes.length === 1) {
              const balanceWithPool = await fetchPoolObjectFromBalance(
                balanceRes[0],
                selectedNamespace,
                poolCache,
                setPoolCache
              );
              setViewBalance(balanceWithPool);
            }
          })
          .catch((err) => {
            reportFetchError(err);
          });
      }
    }
  }, [slideID, isMounted]);

  const smallCards: ISmallCard[] = [
    {
      header: t('activity'),
      numErrors: tokenErrorCount,
      errorLink: FF_NAV_PATHS.activityOpErrorPath(selectedNamespace),
      data: [
        { header: t('transfers'), data: tokenTransfersCount },
        { header: t('mint'), data: tokenMintCount },
        { header: t('burn'), data: tokenBurnCount },
      ],
      clickPath: TRANSFERS_PATH,
    },
    {
      header: t('tokenPools'),
      numErrors: tokenPoolErrorCount,
      errorLink: FF_NAV_PATHS.activityOpPoolErrorPath(selectedNamespace),
      data: [{ header: t('total'), data: tokenPoolCount }],
      clickPath: POOLS_PATH,
    },
    {
      header: t('approvals'),
      numErrors: 0,
      data: [{ header: t('total'), data: tokenApprovalCount }],
      clickPath: APPROVALS_PATH,
    },
    {
      header: t('connectors'),
      numErrors: 0,
      data: [{ header: t('total'), data: tokenConnectorCount }],
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const qParams = `?count=true&limit=1${dateFilter?.filterString ?? ''}`;

    isMounted &&
      dateFilter &&
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
        // Approvals
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenApprovals}${qParams}`
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
            // Approvals
            tokenApprovals,
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
              // Approvals
              setTokenApprovalCount(tokenApprovals.total);
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
        });
  }, [selectedNamespace, dateFilter, lastRefreshTime, isMounted]);

  const tokenAccountsColHeaders = [t('key'), t('pool'), t('balance')];
  const tokenAccountRecords: IDataTableRecord[] | undefined =
    tokenBalances?.map((acct, idx) => ({
      key: idx.toString(),
      columns: [
        {
          value: <HashPopover shortHash address={acct.key} />,
        },
        {
          value: (
            <FFTableText
              color="primary"
              text={acct.poolObject?.name ?? ''}
              tooltip={`${acct.poolObject?.standard} - ${t(
                acct.poolObject?.type ?? ''
              )}`}
            />
          ),
        },
        {
          value: (
            <FFTableText
              color="primary"
              text={addDecToAmount(
                acct.balance,
                acct.poolObject ? acct.poolObject.decimals : -1
              )}
              tooltip={getBalanceTooltip(
                acct.balance,
                acct.poolObject ? acct.poolObject.decimals : -1
              )}
            />
          ),
        },
      ],
      onClick: () => {
        setViewBalance(acct);
        // Since a key can have transfers in multiple pools, the slide ID must be a string
        // with the following structure: <key>||<poolID>
        setSlideSearchParam([acct.key, acct.pool].join(KEY_POOL_DELIM));
      },
    }));

  const tokenPoolColHeaders = [t('name'), t('symbol'), t('standard')];
  const tokenPoolRecords: IDataTableRecord[] | undefined = tokenPools?.map(
    (pool) => ({
      key: pool.id,
      columns: [
        {
          value: (
            <FFTableText
              color="primary"
              isComponent
              text={<HashPopover shortHash address={pool.name} />}
              icon={
                <Jazzicon diameter={20} seed={jsNumberForAddress(pool.name)} />
              }
            />
          ),
        },
        {
          value: pool.symbol ? (
            <FFTableText color="primary" text={pool.symbol} />
          ) : (
            <FFTableText color="secondary" text={t('---')} />
          ),
        },
        { value: <FFTableText color="primary" text={pool.standard} /> },
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
      clickPath: TRANSFERS_PATH,
      component: (
        <Histogram
          categoryMap={FF_TRANSFER_CATEGORY_MAP}
          height={'100%'}
          isLoading={isHistLoading}
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
      clickPath: BALANCES_PATH,
      component: (
        <MediumCardTable
          records={tokenAccountRecords}
          columnHeaders={tokenAccountsColHeaders}
          emptyMessage={t('noAccountsWithBalances')}
        ></MediumCardTable>
      ),
    },
    {
      headerText: t('tokenPools'),
      clickPath: POOLS_PATH,
      component: (
        <MediumCardTable
          records={tokenPoolRecords}
          columnHeaders={tokenPoolColHeaders}
          emptyMessage={t('noTokenPools')}
        ></MediumCardTable>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    setIsHistLoading(true);
    const currentTime = dayjs().unix();
    if (isMounted && dateFilter) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
          BucketCollectionEnum.TokenTransfers,
          dateFilter.filterTime,
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
        })
        .finally(() => setIsHistLoading(false));
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPools}`
      )
        .then((pools: ITokenPool[]) => {
          if (isMounted) {
            setTokenPools(pools);
            pools.map((pool) => {
              setPoolCache(
                (poolCache) => new Map(poolCache.set(pool.id, pool))
              );
            });
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenBalances}`
      )
        .then(async (balances: ITokenBalance[]) => {
          if (balances.length === 0) {
            setTokenBalances([]);
          }
          const balancesWithPoolName: ITokenBalanceWithPool[] = [];
          for (const balance of balances) {
            const balanceWithPool = await fetchPoolObjectFromBalance(
              balance,
              selectedNamespace,
              poolCache,
              setPoolCache
            );
            balancesWithPoolName.push({
              ...balance,
              poolObject: balanceWithPool.poolObject ?? undefined,
            });
          }
          isMounted && setTokenBalances(balancesWithPoolName);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [selectedNamespace, lastRefreshTime, dateFilter, isMounted]);

  const tokenTransferColHeaders = [
    t('type'),
    t('pool'),
    t('from'),
    t('to'),
    t('amount'),
    t('blockchainEvent'),
    t('signingKey'),
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
            <FFTableText
              color="primary"
              text={transfer.poolObject?.name ?? ''}
              tooltip={`${transfer.poolObject?.standard} - ${t(
                transfer.poolObject?.type ?? ''
              )}`}
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
          value: (
            <FFTableText
              color="primary"
              text={addDecToAmount(
                transfer.amount,
                transfer.poolObject ? transfer.poolObject.decimals : -1
              )}
              tooltip={getBalanceTooltip(
                transfer.amount,
                transfer.poolObject ? transfer.poolObject.decimals : -1
              )}
            />
          ),
        },
        {
          value: <HashPopover address={transfer.protocolId}></HashPopover>,
        },
        {
          value: (
            <HashPopover shortHash={true} address={transfer.key}></HashPopover>
          ),
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={getFFTime(transfer.created)}
              tooltip={getFFTime(transfer.created, true)}
            />
          ),
        },
      ],
      onClick: () => {
        setViewTransfer(transfer);
        setSlideSearchParam(transfer.localId);
      },
      leftBorderColor: FF_TRANSFER_CATEGORY_MAP[transfer.type]?.color,
    }));

  // Recent token transfers
  useEffect(() => {
    setTokenTransfers(undefined);
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenTransfers
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }`
      )
        .then(async (tokenTransferRes: IPagedTokenTransferResponse) => {
          if (isMounted) {
            if (tokenTransferRes.items.length === 0) {
              setTokenTransfers([]);
              setTokenTransferTotal(tokenTransferRes.total);
              return;
            }
            const enrichedTransfers: ITokenTransferWithPool[] = [];
            for (const transfer of tokenTransferRes.items) {
              const transferWithPool = await fetchPoolObjectFromTransfer(
                transfer,
                selectedNamespace,
                poolCache,
                setPoolCache
              );
              enrichedTransfers.push({
                ...transfer,
                poolObject: transferWithPool.poolObject,
              });
            }
            setTokenTransfers(enrichedTransfers);
            setTokenTransferTotal(tokenTransferRes.total);
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
    dateFilter,
    isMounted,
  ]);

  return (
    <>
      <Header
        title={t('dashboard')}
        subtitle={t('tokens')}
        showRefreshBtn={hasTransferEvent(newEvents)}
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
          header={t('recentTokenTransfers')}
          clickPath={TRANSFERS_PATH}
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
          dashboardSize
        />
      </FFPageLayout>
      {viewTransfer && (
        <TransferSlide
          transfer={viewTransfer}
          open={!!viewTransfer}
          onClose={() => {
            setViewTransfer(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
      {viewBalance && (
        <BalanceSlide
          balance={viewBalance}
          open={!!viewBalance}
          onClose={() => {
            setViewBalance(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
