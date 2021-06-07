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
import {
  Grid,
  Typography,
  TablePagination,
  Box,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import BroadcastIcon from 'mdi-react/BroadcastIcon';
import {
  IDataTableRecord,
  ITransaction,
  ITimelineItem,
  CreatedFilterOptions,
} from '../../interfaces';
import { DataTable } from '../../components/DataTable/DataTable';
import { HashPopover } from '../../components/HashPopover';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { DataTimeline } from '../../components/DataTimeline/DataTimeline';
import { DataViewSwitch } from '../../components/DataViewSwitch';
import { FilterSelect } from '../../components/FilterSelect';

const PAGE_LIMITS = [10, 25];

export const Transactions: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const { dataView } = useContext(ApplicationContext);
  const [createdFilter, setCreatedFilter] = useState<CreatedFilterOptions>(
    '24hours'
  );

  const createdQueryOptions = [
    {
      value: '24hours',
      label: t('last24Hours'),
    },
    {
      value: '7days',
      label: t('last7Days'),
    },
    {
      value: '30days',
      label: t('last30Days'),
    },
  ];

  const columnHeaders = [
    t('hash'),
    t('blockNumber'),
    t('author'),
    t('status'),
    t('dateMined'),
  ];

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
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      className={classes.pagination}
    />
  );

  useEffect(() => {
    setLoading(true);
    let createdFilterString = `&created=>=${dayjs()
      .subtract(24, 'hours')
      .unix()}`;
    if (createdFilter === '30days') {
      createdFilterString = `&created=>=${dayjs().subtract(30, 'days').unix()}`;
    }
    if (createdFilter === '7days') {
      createdFilterString = `&created=>=${dayjs().subtract(7, 'days').unix()}`;
    }

    fetch(
      `/api/v1/namespaces/${selectedNamespace}/transactions?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterString}`
    )
      .then(async (response) => {
        if (response.ok) {
          setTransactions(await response.json());
        } else {
          console.log('error fetching transactions');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rowsPerPage, currentPage, selectedNamespace, createdFilter]);

  const records: IDataTableRecord[] = transactions.map((tx: ITransaction) => ({
    key: tx.id,
    columns: [
      {
        value: <HashPopover textColor="secondary" address={tx.hash} />,
      },
      { value: tx.info?.blockNumber },
      {
        value: (
          <HashPopover textColor="secondary" address={tx.subject.author} />
        ),
      },
      { value: tx.status },
      {
        value: tx.confirmed
          ? dayjs(tx.confirmed).format('MM/DD/YYYY h:mm A')
          : undefined,
      },
    ],
    onClick: () => {
      history.push(`/transactions/${tx.id}`);
    },
  }));

  const buildTimelineElements = (
    transactions: ITransaction[]
  ): ITimelineItem[] => {
    return transactions.map((tx: ITransaction) => ({
      title: tx.hash,
      description: tx.status,
      time: dayjs(tx.created).format('MM/DD/YYYY h:mm A'),
      icon: <BroadcastIcon />,
      onClick: () => {
        history.push(`/transactions/${tx.id}`);
      },
    }));
  };

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container wrap="nowrap" direction="column" className={classes.root}>
        <Grid container spacing={2} item direction="row">
          <Grid item>
            <Typography className={classes.header} variant="h4">
              {t('transactions')}
            </Typography>
          </Grid>
          <Box className={classes.separator} />
          <Grid item>
            <FilterSelect
              filter={createdFilter}
              setFilter={setCreatedFilter}
              filterItems={createdQueryOptions}
            />
          </Grid>
          <Grid item>
            <DataViewSwitch />
          </Grid>
        </Grid>
        {dataView === 'timeline' && (
          <Grid className={classes.timelineContainer} xs={12} container item>
            <DataTimeline items={buildTimelineElements(transactions)} />
          </Grid>
        )}
        {dataView === 'list' && (
          <Grid container item>
            <DataTable
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              {...{ columnHeaders }}
              {...{ records }}
              {...{ pagination }}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 20,
    paddingLeft: 120,
    paddingRight: 120,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  header: {
    fontWeight: 'bold',
  },
  pagination: {
    color: theme.palette.text.secondary,
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  timelineContainer: {
    paddingTop: theme.spacing(4),
  },
  separator: {
    flexGrow: 1,
  },
}));
