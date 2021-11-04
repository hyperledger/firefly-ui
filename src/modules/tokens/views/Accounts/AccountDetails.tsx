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
  Paper,
  TablePagination,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import FireIcon from 'mdi-react/FireIcon';
import StamperIcon from 'mdi-react/StamperIcon';
import SwapHorizontalIcon from 'mdi-react/SwapHorizontalIcon';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { HashPopover } from '../../../../core/components/HashPopover';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import {
  IDataTableRecord,
  ITokenBalance,
  ITokenPool,
  ITokenTransfer,
} from '../../../../core/interfaces';
import { fetchWithCredentials, getShortHash } from '../../../../core/utils';
import { useTokensTranslation } from '../../registration';

const PAGE_LIMITS = [5, 10];

interface PoolDetailsOptions {
  accountKey: string;
  pool: ITokenPool;
  balance?: ITokenBalance;
}

export const AccountDetails: () => JSX.Element = () => {
  const history = useHistory();
  const { t } = useTokensTranslation();
  const { key, pool } = useParams<{ key: string; pool: string }>();
  const classes = useStyles();
  const { selectedNamespace } = useContext(NamespaceContext);
  const { lastEvent } = useContext(ApplicationContext);
  const [loading, setLoading] = useState(false);
  const [transfersUpdated, setTransfersUpdated] = useState(0);
  const [poolDetails, setPoolDetails] = useState<ITokenPool | undefined>();
  const [tokenBalances, setTokenBalances] = useState<ITokenBalance[]>([]);
  const [tokenBalancesTotal, setTokenBalancesTotal] = useState(0);
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>([]);
  const [tokenTransfersTotal, setTokenTransfersTotal] = useState(0);
  const [tokensPage, setTokensPage] = useState(0);
  const [transfersPage, setTransfersPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const changeTokensPage = (_event: unknown, newPage: number) => {
    if (
      newPage > tokensPage &&
      rowsPerPage * (tokensPage + 1) >= tokenBalancesTotal
    ) {
      return;
    }
    setTokensPage(newPage);
  };

  const changeTransfersPage = (_event: unknown, newPage: number) => {
    if (
      newPage > transfersPage &&
      rowsPerPage * (transfersPage + 1) >= tokenTransfersTotal
    ) {
      return;
    }
    setTransfersPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokensPage(0);
    setTransfersPage(0);
    setRowsPerPage(+event.target.value);
  };

  const tokensPagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={tokensPage}
      onPageChange={changeTokensPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      className={classes.pagination}
    />
  );

  const transfersPagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={transfersPage}
      onPageChange={changeTransfersPage}
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
      `/api/v1/namespaces/${selectedNamespace}/tokens/pools/${pool}`
    )
      .then(async (tokenPoolResponse) => {
        if (tokenPoolResponse.ok) {
          const details: ITokenPool = await tokenPoolResponse.json();
          setPoolDetails(details);
        } else {
          console.log('error fetching token pool details');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace, pool]);

  useEffect(() => {
    if (poolDetails === undefined) {
      return;
    }
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/tokens/balances?key=${key}&pool=${
        poolDetails.id
      }&balance=>0&count&limit=${rowsPerPage}&skip=${rowsPerPage * tokensPage}`
    ).then(async (tokenBalanceResponse) => {
      if (tokenBalanceResponse.ok) {
        const balances = await tokenBalanceResponse.json();
        setTokenBalancesTotal(balances.total);
        setTokenBalances(balances.items);
      } else {
        console.log('error fetching token balances');
      }
    });
  }, [
    rowsPerPage,
    tokensPage,
    selectedNamespace,
    key,
    transfersUpdated,
    poolDetails,
  ]);

  useEffect(() => {
    if (poolDetails === undefined) {
      return;
    }
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/tokens/transfers?fromOrTo=${key}&pool=${
        poolDetails.id
      }&limit=${rowsPerPage}&skip=${rowsPerPage * transfersPage}&count`
    ).then(async (tokenTransfersResponse) => {
      if (tokenTransfersResponse.ok) {
        const tokenTransfers = await tokenTransfersResponse.json();
        setTokenTransfersTotal(tokenTransfers.total);
        setTokenTransfers(tokenTransfers.items);
      } else {
        console.log('error fetching token transfers');
      }
    });
  }, [
    rowsPerPage,
    transfersPage,
    selectedNamespace,
    key,
    transfersUpdated,
    poolDetails,
  ]);

  const isNFT = poolDetails?.type === 'nonfungible';

  const transferIconMap = {
    burn: <FireIcon />,
    mint: <StamperIcon />,
    transfer: <SwapHorizontalIcon />,
  };

  const tokenIndexColumnHeaders = [t('tokenIndex'), t('updated')];

  const tokenTransfersColumnHeaders = [
    t('txHash'),
    t('method'),
    isNFT ? t('tokenIndex') : t('amount'),
    t('from'),
    t('to'),
    t('timestamp'),
  ];

  const tokenIndexRecords: IDataTableRecord[] = tokenBalances?.map(
    (balance: ITokenBalance) => ({
      key: balance.pool + ':' + balance.tokenIndex,
      columns: [
        { value: balance.tokenIndex },
        { value: dayjs(balance.updated).format('MM/DD/YYYY h:mm A') },
      ],
    })
  );

  const tokenTransfersRecords: IDataTableRecord[] = tokenTransfers?.map(
    (tokenTransfer: ITokenTransfer) => ({
      key: tokenTransfer.tx.id,
      columns: [
        {
          value: (
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item className={classes.paddingRight}>
                {transferIconMap[tokenTransfer.type]}
              </Grid>
              <Grid item>
                <HashPopover
                  shortHash={true}
                  textColor="primary"
                  address={tokenTransfer.tx.id}
                />
              </Grid>
            </Grid>
          ),
        },
        { value: t(tokenTransfer.type) },
        isNFT
          ? { value: tokenTransfer.tokenIndex ?? t('emptyPlaceholder') }
          : { value: tokenTransfer.amount },
        {
          value: tokenTransfer.from ? (
            <HashPopover
              shortHash={true}
              textColor="primary"
              address={tokenTransfer.from}
            />
          ) : (
            t('emptyPlaceholder')
          ),
        },
        {
          value: tokenTransfer.to ? (
            <HashPopover
              shortHash={true}
              textColor="primary"
              address={tokenTransfer.to}
            />
          ) : (
            t('emptyPlaceholder')
          ),
        },
        { value: dayjs(tokenTransfer.created).format('MM/DD/YYYY h:mm A') },
      ],
    })
  );

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
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                history.push(
                  `/namespace/${selectedNamespace}/tokens/accounts/${key}`
                )
              }
            >
              {getShortHash(key)}
            </Link>
            <Link underline="none" color="text.primary">
              {pool}
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
            {pool}
          </Typography>
        </Grid>
        <Grid container spacing={4} item direction="row">
          {loading ? (
            <Grid item>
              <CircularProgress />
            </Grid>
          ) : (
            poolDetails && (
              <PoolDetails
                accountKey={key}
                pool={poolDetails}
                balance={tokenBalances[0]}
              />
            )
          )}
          {isNFT && (
            <Grid container item>
              {tokenBalances.length ? (
                <DataTable
                  header={t('tokenIndexes')}
                  minHeight="300px"
                  maxHeight="calc(100vh - 340px)"
                  columnHeaders={tokenIndexColumnHeaders}
                  records={tokenIndexRecords}
                  {...{ pagination: tokensPagination }}
                />
              ) : (
                <DataTableEmptyState
                  message={t('noTokenBalancesToDisplay')}
                ></DataTableEmptyState>
              )}
            </Grid>
          )}
          <Grid container item>
            {tokenTransfers.length ? (
              <DataTable
                header={t('transferHistory')}
                minHeight="300px"
                maxHeight="calc(100vh - 340px)"
                columnHeaders={tokenTransfersColumnHeaders}
                records={tokenTransfersRecords}
                {...{ pagination: transfersPagination }}
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

const PoolDetails = (options: PoolDetailsOptions): JSX.Element => {
  const { t } = useTokensTranslation();
  const classes = useStyles();
  const { accountKey, pool, balance } = options;
  const isNFT = pool.type === 'nonfungible';
  const detailsData = [
    {
      label: t('key'),
      value: <HashPopover address={accountKey}></HashPopover>,
    },
    {
      label: t('poolID'),
      value: <HashPopover address={pool.id}></HashPopover>,
    },
    { label: t('name'), value: pool.name },
    { label: t('type'), value: t(pool.type) },
    { label: t('standard'), value: pool.standard },
  ];
  if (balance !== undefined) {
    detailsData.push({
      label: t('updated'),
      value: dayjs(balance.updated).format('MM/DD/YYYY h:mm A'),
    });
    if (!isNFT) {
      detailsData.push({
        label: t('balance'),
        value: balance.balance,
      });
    }
  }
  return (
    <Grid item xs={6}>
      <Paper className={classes.paper}>
        <List>
          <Grid container spacing={2}>
            {detailsData.map((data) => {
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
  );
};

const useStyles = makeStyles((theme) => ({
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
