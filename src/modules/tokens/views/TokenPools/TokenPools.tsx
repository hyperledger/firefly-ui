// Copyright © 2021 Kaleido, Inc.
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
import {
  CircularProgress,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TablePagination,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import Jazzicon from 'react-jazzicon';
import { useHistory } from 'react-router';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { IDataTableRecord, ITokenPool } from '../../../../core/interfaces';
import {
  fetchWithCredentials,
  jsNumberForAddress,
} from '../../../../core/utils';
import { useTokensTranslation } from '../../registration';

const PAGE_LIMITS = [10, 25];

export const TokenPools: () => JSX.Element = () => {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTokensTranslation();
  const [loading, setLoading] = useState(false);
  const [poolsUpdated, setPoolsUpdated] = useState(0);
  const { selectedNamespace } = useContext(NamespaceContext);
  const { lastEvent } = useContext(ApplicationContext);
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [tokenPoolsTotal, setTokenPoolsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (
      newPage > currentPage &&
      rowsPerPage * (currentPage + 1) >= tokenPoolsTotal
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
      className={classes.pagination}
    />
  );

  useEffect(() => {
    if (lastEvent && lastEvent.data) {
      const eventJson = JSON.parse(lastEvent.data);
      if (eventJson.type === 'token_pool_confirmed') {
        setPoolsUpdated(new Date().getTime());
      }
    }
  }, [lastEvent]);

  useEffect(() => {
    setLoading(true);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/tokens/pools?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }&count`
    )
      .then(async (tokenPoolsResponse) => {
        if (tokenPoolsResponse.ok) {
          const tokenPools = await tokenPoolsResponse.json();
          setTokenPoolsTotal(tokenPools.total);
          setTokenPools(tokenPools.items);
        } else {
          console.log('error fetching token pools');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rowsPerPage, currentPage, selectedNamespace, poolsUpdated]);

  const tokenPoolsColumnHeaders = [
    t('name'),
    t('type'),
    t('standard'),
    t('protocolID'),
    t('created'),
  ];

  const tokenPoolsRecords: IDataTableRecord[] = tokenPools.map(
    (tokenPool: ITokenPool) => ({
      key: tokenPool.id,
      columns: [
        {
          value: (
            <ListItem>
              <ListItemAvatar>
                <Jazzicon
                  diameter={34}
                  seed={jsNumberForAddress(tokenPool.id)}
                />
              </ListItemAvatar>
              <ListItemText primary={tokenPool.name} />
            </ListItem>
          ),
        },
        {
          value: t(tokenPool.type),
        },
        {
          value: tokenPool.standard,
        },
        {
          value: tokenPool.protocolId,
        },
        { value: dayjs(tokenPool.created).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => {
        history.push(
          `/namespace/${selectedNamespace}/tokens/tokenPools/${tokenPool.name}`
        );
      },
    })
  );

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container justifyContent="center">
      <Grid container item wrap="nowrap" direction="column">
        <Grid container item direction="row">
          <Grid className={classes.headerContainer} item>
            <Typography variant="h4" className={classes.header}>
              {t('tokenPools')}
            </Typography>
          </Grid>
          <Box className={classes.separator} />
        </Grid>
        <Grid container item>
          {tokenPools.length ? (
            <DataTable
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              columnHeaders={tokenPoolsColumnHeaders}
              records={tokenPoolsRecords}
              {...{ pagination }}
            />
          ) : (
            <DataTableEmptyState
              message={t('noTokenPoolsToDisplay')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  pagination: {
    color: theme.palette.text.secondary,
  },
  separator: {
    flexGrow: 1,
  },
}));
