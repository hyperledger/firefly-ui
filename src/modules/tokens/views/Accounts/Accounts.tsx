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
  Box,
  CircularProgress,
  Grid,
  TablePagination,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { HashPopover } from '../../../../core/components/HashPopover';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { IDataTableRecord, ITokenAccount } from '../../../../core/interfaces';
import { fetchWithCredentials } from '../../../../core/utils';
import { useTokensTranslation } from '../../registration';

const PAGE_LIMITS = [10, 25];

export const Accounts: () => JSX.Element = () => {
  const classes = useStyles();
  const { t } = useTokensTranslation();
  const [loading, setLoading] = useState(false);
  const [tokenAccounts, setTokenAccounts] = useState<ITokenAccount[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
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
    setLoading(true);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/tokens/accounts?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }`
    )
      .then(async (tokenAccountsResponse) => {
        if (tokenAccountsResponse.ok) {
          setTokenAccounts(await tokenAccountsResponse.json());
        } else {
          console.log('error fetching token accounts');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const tokenAccountsColumnHeaders = [
    t('address'),
    t('balance'),
    t('poolProtocolID'),
    t('tokenIndex'),
    t('lastUpdated'),
  ];

  const tokenAccountsRecords: IDataTableRecord[] = tokenAccounts.map(
    (tokenAccount: ITokenAccount) => ({
      // TODO: Figure out another unique key
      key: tokenAccount.updated,
      columns: [
        {
          value: (
            <HashPopover
              shortHash={true}
              textColor="secondary"
              address={tokenAccount.key}
            />
          ),
        },
        { value: tokenAccount.balance },
        { value: tokenAccount.poolProtocolId },
        { value: tokenAccount.tokenIndex },
        { value: dayjs(tokenAccount.updated).format('MM/DD/YYYY h:mm A') },
      ],
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
    <>
      <Grid container justifyContent="center">
        <Grid container wrap="nowrap" direction="column">
          <Grid container item direction="row">
            <Grid className={classes.headerContainer} item>
              <Typography variant="h4" className={classes.header}>
                {t('accounts')}
              </Typography>
            </Grid>
            <Box className={classes.separator} />
          </Grid>
          <Grid container item>
            {tokenAccounts.length ? (
              <DataTable
                minHeight="300px"
                maxHeight="calc(100vh - 340px)"
                columnHeaders={tokenAccountsColumnHeaders}
                records={tokenAccountsRecords}
                pagination={
                  tokenAccountsRecords.length > rowsPerPage
                    ? pagination
                    : undefined
                }
              />
            ) : (
              <DataTableEmptyState
                message={t('noTokenAccountsToDisplay')}
              ></DataTableEmptyState>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
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
