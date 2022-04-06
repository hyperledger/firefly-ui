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
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import { PoolStatusChip } from '../../../components/Chips/PoolStatusChip';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_NAV_PATHS,
  FF_Paths,
  IDataTableRecord,
  IPagedTokenPoolResponse,
  ITokenPool,
  PoolFilters,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime, jsNumberForAddress } from '../../../utils';
import { hasPoolEvent } from '../../../utils/wsEvents';

export const TokensPools: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  // Token pools
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>();
  // Token pools totals
  const [tokenPoolsTotal, setTokenPoolsTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Token pools
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenPools
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((tokenPoolsRes: IPagedTokenPoolResponse) => {
          setTokenPools(tokenPoolsRes.items);
          setTokenPoolsTotal(tokenPoolsRes.total);
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

  const tokenPoolColHeaders = [
    t(''),
    t('name'),
    t('symbol'),
    t('type'),
    t('standard'),
    t('connector'),
    t('protocolID'),
    t('state'),
    t('created'),
  ];
  const tokenPoolRecords: IDataTableRecord[] | undefined = tokenPools?.map(
    (pool) => ({
      key: pool.id,
      columns: [
        {
          value: (
            <Jazzicon diameter={34} seed={jsNumberForAddress(pool.name)} />
          ),
        },
        {
          value: (
            <FFTableText
              isComponent
              color="primary"
              text={
                pool.name.length > 20 ? (
                  <HashPopover address={pool.name} />
                ) : (
                  pool.name
                )
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
        {
          value: <FFTableText color="primary" text={pool.type} />,
        },
        {
          value: <FFTableText color="primary" text={pool.standard} />,
        },
        {
          value: <FFTableText color="primary" text={pool.connector} />,
        },
        {
          value: <FFTableText color="primary" text={pool.protocolId} />,
        },
        {
          value: <PoolStatusChip pool={pool} />,
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(pool.created)} />
          ),
        },
      ],
      onClick: () =>
        navigate(
          FF_NAV_PATHS.tokensPoolDetailsPath(selectedNamespace, pool.id)
        ),
    })
  );

  return (
    <>
      <Header
        title={t('pools')}
        subtitle={t('tokens')}
        showRefreshBtn={hasPoolEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            filter={
              <FilterButton
                onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setFilterAnchor(e.currentTarget)
                }
              />
            }
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
            records={tokenPoolRecords}
            columnHeaders={tokenPoolColHeaders}
            paginate={true}
            emptyStateText={t('noTokenPoolsToDisplay')}
            dataTotal={tokenPoolsTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={PoolFilters}
        />
      )}
    </>
  );
};
