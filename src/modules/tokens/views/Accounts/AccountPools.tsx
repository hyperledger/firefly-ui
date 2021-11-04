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
  Breadcrumbs,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TablePagination,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { HashPopover } from '../../../../core/components/HashPopover';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import {
  IDataTableRecord,
  ITokenAccountPool,
  ITokenBalance,
  ITokenPool,
  ITokenPoolWithBalance,
} from '../../../../core/interfaces';
import {
  fetchWithCredentials,
  jsNumberForAddress,
} from '../../../../core/utils';
import { useTokensTranslation } from '../../registration';
import Jazzicon from 'react-jazzicon';

const PAGE_LIMITS = [5, 10];

export const AccountPools: () => JSX.Element = () => {
  const history = useHistory();
  const { t } = useTokensTranslation();
  const { key } = useParams<{ key: string }>();
  const classes = useStyles();
  const { selectedNamespace } = useContext(NamespaceContext);
  const { lastEvent } = useContext(ApplicationContext);
  const [loading, setLoading] = useState(false);
  const [transfersUpdated, setTransfersUpdated] = useState(0);
  const [tokenPools, setTokenPools] = useState<ITokenPoolWithBalance[]>([]);
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
      if (eventJson.type === 'token_transfer_confirmed') {
        setTransfersUpdated(new Date().getTime());
      }
    }
  }, [lastEvent]);

  useEffect(() => {
    setLoading(true);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/tokens/accounts/${key}/pools?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }&count&sort=-updated`
    )
      .then(async (tokenAccountsResponse) => {
        if (tokenAccountsResponse.ok) {
          const tokenAccounts = await tokenAccountsResponse.json();
          setTokenPoolsTotal(tokenAccounts.count);
          if (tokenAccounts.count > 0) {
            const poolIds: ITokenAccountPool[] = tokenAccounts.items;
            setTokenPools(
              await fetchPoolDetails(
                selectedNamespace,
                key,
                poolIds.map((p) => p.pool)
              )
            );
          } else {
            setTokenPools([]);
          }
        } else {
          console.log('error fetching token account pools');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rowsPerPage, currentPage, selectedNamespace, key, transfersUpdated]);

  const tokenPoolsColumnHeaders = [
    t('name'),
    t('type'),
    t('standard'),
    t('balance'),
    t('lastUpdated'),
  ];

  const tokenPoolsRecords: IDataTableRecord[] = tokenPools?.map(
    (tokenPool: ITokenPoolWithBalance) => ({
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
          value: tokenPool.balance,
        },
        { value: dayjs(tokenPool.updated).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => {
        history.push(
          `/namespace/${selectedNamespace}/tokens/accounts/${key}/${tokenPool.name}`
        );
      },
    })
  );

  const accountData = [
    {
      label: t('key'),
      value: <HashPopover address={key}></HashPopover>,
    },
  ];

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
        <Grid item>
          <Breadcrumbs className={classes.paddingBottom}>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                history.push(`/namespace/${selectedNamespace}/tokens/accounts/`)
              }
            >
              {t('accounts')}
            </Link>
            <Link underline="none" color="text.primary">
              <HashPopover address={key} />
            </Link>
          </Breadcrumbs>
        </Grid>
        <Box className={classes.separator} />
        <Grid
          item
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          className={classes.paddingBottom}
        >
          <Typography className={classes.bold} variant="h4">
            {t('accountDetails')}
          </Typography>
        </Grid>
        <Grid container spacing={4} item direction="row">
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <List>
                <Grid container spacing={2}>
                  {accountData.map((data) => {
                    return (
                      <React.Fragment key={data.label}>
                        <Grid item xs={4}>
                          <Typography color="text.secondary" variant="body1">
                            {data.label}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography>{data.value}</Typography>
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </List>
            </Paper>
          </Grid>
          <Grid container item>
            {tokenPools.length ? (
              <DataTable
                header={t('tokenPools')}
                minHeight="300px"
                maxHeight="calc(100vh - 340px)"
                columnHeaders={tokenPoolsColumnHeaders}
                records={tokenPoolsRecords}
                {...{ pagination }}
              />
            ) : (
              <DataTableEmptyState
                message={t('noTokenTransfersToDisplay')}
              ></DataTableEmptyState>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const fetchPoolDetails = async (
  namespace: string,
  key: string,
  ids: string[]
): Promise<ITokenPoolWithBalance[]> => {
  const pools: ITokenPoolWithBalance[] = [];
  for (const id of ids) {
    const [poolResponse, balanceResponse] = await Promise.all([
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/tokens/pools/${id}`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/tokens/balances?key=${key}&pool=${id}&sort=-updated&limit=1`
      ),
    ]);

    if (!poolResponse.ok) {
      console.log(`error fetching token pool ${id}`);
      continue;
    }
    if (!balanceResponse.ok) {
      console.log(`error fetching balance for token pool ${id}`);
      continue;
    }

    const pool: ITokenPool = await poolResponse.json();
    const isNFT = pool.type === 'nonfungible';
    const balances: ITokenBalance[] = await balanceResponse.json();
    if (balances.length === 0) {
      continue;
    }

    pools.push({
      ...pool,
      updated: balances[0].updated,
      balance: isNFT ? '--' : balances[0].balance,
    });
  }
  return pools;
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
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
  },
  separator: {
    flexGrow: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  paddingBottom: {
    paddingBottom: theme.spacing(2),
  },
  paddingRight: {
    paddingRight: theme.spacing(2),
  },
  pagination: {
    color: theme.palette.text.secondary,
  },
}));
