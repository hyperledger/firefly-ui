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
import { TablePagination, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { IDataTableRecord, ITransaction } from '../../interfaces';
import { DataTable } from '../../components/DataTable/DataTable';
import { HashPopover } from '../../components/HashPopover';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { fetchWithCredentials } from '../../utils';

const PAGE_LIMITS = [10, 25];

export const TransactionList: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
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
    let createdFilterString = `&created=>=${dayjs()
      .subtract(24, 'hours')
      .unix()}`;
    if (createdFilter === '30days') {
      createdFilterString = `&created=>=${dayjs().subtract(30, 'days').unix()}`;
    }
    if (createdFilter === '7days') {
      createdFilterString = `&created=>=${dayjs().subtract(7, 'days').unix()}`;
    }

    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/transactions?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterString}`
    ).then(async (response) => {
      if (response.ok) {
        setTransactions(await response.json());
      } else {
        console.log('error fetching transactions');
      }
    });
  }, [rowsPerPage, currentPage, selectedNamespace, createdFilter, lastEvent]);

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
      onChangeRowsPerPage={handleChangeRowsPerPage}
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
        history.push(`/namespace/${selectedNamespace}/transactions/${tx.id}`);
      },
    }));
  };

  return (
    <DataTable
      minHeight="300px"
      maxHeight="calc(100vh - 340px)"
      records={buildTableRecords(transactions)}
      {...{ columnHeaders }}
      {...{ pagination }}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  pagination: {
    color: theme.palette.text.secondary,
  },
}));
