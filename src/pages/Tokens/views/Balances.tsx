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

import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { BalanceSlide } from '../../../components/Slides/BalanceSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { PoolContext } from '../../../contexts/PoolContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BalanceFilters,
  FF_Paths,
  IDataTableRecord,
  IPagedTokenBalanceResponse,
  ITokenBalance,
  ITokenBalanceWithPool,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import {
  addDecToAmount,
  fetchCatcher,
  fetchPoolObjectFromBalance,
  getBalanceTooltip,
  getFFTime,
} from '../../../utils';
import { hasTransferEvent } from '../../../utils/wsEvents';

export const KEY_POOL_DELIM = '||';

export const TokensBalances: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { poolCache, setPoolCache } = useContext(PoolContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  // Token balances
  const [tokenBalances, setTokenBalances] = useState<
    ITokenBalanceWithPool[] | undefined
  >();
  // Token balances totals
  const [tokenBalancesTotal, setTokenBalancesTotal] = useState(0);
  const [viewBalance, setViewBalance] = useState<ITokenBalanceWithPool>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

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
        return;
      }

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
  }, [slideID, isMounted]);

  // Token balances
  useEffect(() => {
    setTokenBalances(undefined);
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenBalances
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then(async (tokenBalancesRes: IPagedTokenBalanceResponse) => {
          setTokenBalancesTotal(tokenBalancesRes.total);
          if (tokenBalancesRes.items.length === 0) {
            setTokenBalances([]);
          }
          const balancesWithPoolName: ITokenBalanceWithPool[] = [];
          for (const balance of tokenBalancesRes.items) {
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
          isMounted &&
            setTokenBalances((tokenBalances) => {
              return tokenBalances
                ? [...tokenBalances, ...balancesWithPoolName]
                : balancesWithPoolName;
            });
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    dateFilter,
    filterString,
    lastRefreshTime,
    isMounted,
  ]);

  const tokenBalanceColHeaders = [
    t('key'),
    t('balance'),
    t('pool'),
    t('uri'),
    t('connector'),
    t('updated'),
  ];

  const tokenBalanceRecords: IDataTableRecord[] | undefined =
    tokenBalances?.map((balance) => ({
      key: `${balance.key}${balance.pool}`,
      columns: [
        {
          value: <HashPopover address={balance.key} />,
        },
        {
          value: (
            <FFTableText
              color="primary"
              text={addDecToAmount(
                balance.balance,
                balance.poolObject ? balance.poolObject.decimals : -1
              )}
              tooltip={getBalanceTooltip(
                balance.balance,
                balance.poolObject ? balance.poolObject.decimals : -1
              )}
            />
          ),
        },
        {
          value: (
            <FFTableText
              color="primary"
              text={balance.poolObject?.name ?? ''}
              tooltip={`${balance.poolObject?.standard} - ${t(
                balance.poolObject?.type ?? ''
              )}`}
            />
          ),
        },
        {
          value: balance.uri?.length ? (
            <HashPopover address={balance.uri} />
          ) : (
            <FFTableText color="secondary" text={t('noURIForToken')} />
          ),
        },
        {
          value: <FFTableText color="primary" text={balance.connector} />,
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={getFFTime(balance.updated)}
              tooltip={getFFTime(balance.updated, true)}
            />
          ),
        },
      ],
      onClick: () => {
        setViewBalance(balance);
        // Since a key can have transfers in multiple pools, the slide ID must be a string
        // with the following structure: <key>||<poolID>
        setSlideSearchParam([balance.key, balance.pool].join(KEY_POOL_DELIM));
      },
    }));

  return (
    <>
      <Header
        title={t('balances')}
        subtitle={t('tokens')}
        showRefreshBtn={hasTransferEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <FFPageLayout>
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
          records={tokenBalanceRecords}
          columnHeaders={tokenBalanceColHeaders}
          paginate={true}
          emptyStateText={t('noAccountsWithBalances')}
          dataTotal={tokenBalancesTotal}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          filterButton={
            <FilterButton
              onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                setFilterAnchor(e.currentTarget)
              }
            />
          }
        />
      </FFPageLayout>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={BalanceFilters}
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
