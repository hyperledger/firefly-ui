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

import React, { useState, useEffect, useContext } from 'react';
import { Card, Grid, TablePagination } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import {
  FFColors,
  ICreatedFilter,
  IDataTableRecord,
  IMetric,
  ITransaction,
} from '../../../../core/interfaces';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { HashPopover } from '../../../../core/components/HashPopover';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { fetchWithCredentials, getCreatedFilter } from '../../../../core/utils';
import { useDataTranslation } from '../../registration';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { Histogram } from '../../../../core/components/Charts/Histogram';

const PAGE_LIMITS = [10, 25];

interface Props {
  filterString?: string;
}

export const TransactionList: React.FC<Props> = ({ filterString }) => {
  const history = useHistory();
  const { t } = useDataTranslation();
  const classes = useStyles();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [txMetrics, setTxMetrics] = useState<IMetric[]>();
  const { selectedNamespace } = useContext(NamespaceContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const { createdFilter, lastEvent } = useContext(ApplicationContext);

  const columnHeaders = [
    t('hash'),
    t('blockNumber'),
    t('signer'),
    t('status'),
    t('dateMined'),
  ];

  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/transactions?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterObject.filterString}${
        filterString !== undefined ? filterString : ''
      }`
    ).then(async (response) => {
      if (response.ok) {
        setTransactions(await response.json());
      } else {
        console.log('error fetching transactions');
      }
    });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    createdFilter,
    lastEvent,
    filterString,
  ]);

  // Chart
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/charts/histogram/transactions?startTime=${createdFilterObject.filterTime}&endTime=${currentTime}&buckets=100`
    ).then(async (txMetricsResponse) => {
      if (txMetricsResponse.ok) {
        const txMetricsJson: IMetric[] = await txMetricsResponse.json();
        setTxMetrics(txMetricsJson);
      } else {
        console.log('error fetching metrics data');
      }
    });
  }, [selectedNamespace, createdFilter]);

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

  const buildTableRecords = (
    transactions: ITransaction[]
  ): IDataTableRecord[] => {
    return transactions.map((tx: ITransaction) => ({
      key: tx.id,
      columns: [
        {
          value: <HashPopover textColor="secondary" address={tx.hash} />,
        },
        { value: tx.info?.blockNumber },
        {
          value: (
            <HashPopover textColor="secondary" address={tx.subject.signer} />
          ),
        },
        { value: tx.status },
        {
          value: tx.created
            ? dayjs(tx.created).format('MM/DD/YYYY h:mm A')
            : undefined,
        },
      ],
      onClick: () => {
        history.push(
          `/namespace/${selectedNamespace}/data/transactions/${tx.id}`
        );
      },
    }));
  };

  return buildTableRecords(transactions).length ? (
    <>
      <Grid className={classes.cardContainer} container>
        <Card sx={{ height: '200px', width: '100%' }}>
          {txMetrics?.find((m) => m.count !== '0') && (
            <Histogram
              colors={[FFColors.Blue]}
              data={txMetrics}
              indexBy={'timestamp'}
              keys={['count']}
              xAxisTitle={''}
              yAxisTitle={''}
            />
          )}
        </Card>
      </Grid>
      <Grid container item>
        <DataTable
          minHeight="300px"
          maxHeight="calc(100vh - 340px)"
          records={buildTableRecords(transactions)}
          {...{ columnHeaders }}
          {...{ pagination }}
        />
      </Grid>
    </>
  ) : (
    <Grid container item className={classes.spacing}>
      <DataTableEmptyState
        message={t('noTransactionsToDisplay')}
      ></DataTableEmptyState>
    </Grid>
  );
};
const useStyles = makeStyles((theme) => ({
  cardContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  pagination: {
    color: theme.palette.text.secondary,
  },
  spacing: {
    paddingTop: theme.spacing(4),
  },
}));
