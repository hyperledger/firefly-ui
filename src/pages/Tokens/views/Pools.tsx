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

import { Button, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { PoolSlide } from '../../../components/Slides/PoolSlide';
import { DataTable } from '../../../components/Tables/Table';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  ICreatedFilter,
  IPagedTokenPoolResponse,
  ITokenPool,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, jsNumberForAddress } from '../../../utils';

export const TokensPools: () => JSX.Element = () => {
  const { createdFilter, selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Token pools
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>();
  // Token pools totals
  const [tokenPoolsTotal, setTokenPoolsTotal] = useState(0);
  // View transfer slide out
  const [viewPool, setViewPool] = useState<ITokenPool | undefined>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Token pools
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.tokenPools
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((tokenPoolsRes: IPagedTokenPoolResponse) => {
        setTokenPools(tokenPoolsRes.items);
        setTokenPoolsTotal(tokenPoolsRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const tokenPoolColHeaders = [
    t('name'),
    t('type'),
    t('standard'),
    t('protocolID'),
    t('created'),
  ];
  const tokenPoolRecords: IDataTableRecord[] | undefined = tokenPools?.map(
    (pool) => ({
      key: pool.id,
      columns: [
        {
          value: (
            <Grid
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              container
            >
              <Grid container item justifyContent="flex-start" xs={4}>
                <Jazzicon diameter={34} seed={jsNumberForAddress(pool.id)} />
              </Grid>
              <Grid container item justifyContent="flex-start" xs={8}>
                <Typography>{pool.name}</Typography>
              </Grid>
            </Grid>
          ),
        },
        {
          value: <Typography>{pool.type}</Typography>,
        },
        {
          value: <Typography>{pool.standard}</Typography>,
        },
        {
          value: <Typography>{pool.protocolId}</Typography>,
        },
        { value: dayjs(pool.created).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => setViewPool(pool),
    })
  );

  return (
    <>
      <Header title={t('pools')} subtitle={t('tokens')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allPools')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
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
      {viewPool && (
        <PoolSlide
          pool={viewPool}
          open={!!viewPool}
          onClose={() => {
            setViewPool(undefined);
          }}
        />
      )}
    </>
  );
};