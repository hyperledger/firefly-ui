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
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_EVENTS,
  FF_NAV_PATHS,
  FF_Paths,
  ICreatedFilter,
  IDataTableRecord,
  IPagedTokenPoolResponse,
  ITokenPool,
  PoolFilters,
  PoolStateColorMap,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import {
  fetchCatcher,
  getCreatedFilter,
  getFFTime,
  jsNumberForAddress,
} from '../../../utils';
import { isEventType } from '../../../utils/wsEvents';

export const TokensPools: () => JSX.Element = () => {
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
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  // Token pools
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>();
  // Token pools totals
  const [tokenPoolsTotal, setTokenPoolsTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);
  // Last event tracking
  const [numNewEvents, setNumNewEvents] = useState(0);
  const [lastRefreshTime, setLastRefresh] = useState<string>(
    new Date().toISOString()
  );

  useEffect(() => {
    isMounted &&
      isEventType(lastEvent, FF_EVENTS.TOKEN_POOL_CONFIRMED) &&
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

  // Token pools
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenPools
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          createdFilterObject.filterString
        }${filterString !== undefined ? filterString : ''}`
      )
        .then((tokenPoolsRes: IPagedTokenPoolResponse) => {
          setTokenPools(tokenPoolsRes.items);
          setTokenPoolsTotal(tokenPoolsRes.total);
        })
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => numNewEvents !== 0 && setNumNewEvents(0));
    numNewEvents !== 0 && setNumNewEvents(0);
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    createdFilter,
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
            <FFTableText color="secondary" text={t('noSymbolSpecified')} />
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
          value: (
            <Chip
              sx={{ backgroundColor: PoolStateColorMap[pool.state] }}
              label={pool.state.toLocaleUpperCase()}
            ></Chip>
          ),
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
        onRefresh={refreshData}
        numNewEvents={numNewEvents}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allPools')}
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
          addFilter={(filter: string) =>
            setActiveFilters((activeFilters) => [...activeFilters, filter])
          }
        />
      )}
    </>
  );
};
