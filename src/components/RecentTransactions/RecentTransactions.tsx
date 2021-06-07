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

import React from 'react';
import { Paper, Grid, makeStyles, Typography } from '@material-ui/core';
import { TransactionPieChart } from './TransactionPieChart';
import { useTranslation } from 'react-i18next';
import { ITransaction, TXStatus } from '../../interfaces';

interface Props {
  transactions: ITransaction[];
}

const TX_STATUS_COLORS: { [key in TXStatus]: string } = {
  Pending: '#FFCA00',
  Error: '#FF0000',
  Confirmed: '#462DE0',
};

export const RecentTransactions: React.FC<Props> = ({ transactions }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const mapTransactionData = (transactions: ITransaction[]) => {
    // if there are no tx whatsoever, don't display any arcs
    if (transactions.length === 0) return [];

    const data = transactions.reduce((m, { status }) => {
      const count = m.get(status) || 0;
      m.set(status, count + 1);
      return m;
    }, new Map<TXStatus, number>());

    // if there are some tx, provide filler values for missing statuses to show all arcs
    if (!data.has(TXStatus.Confirmed)) {
      data.set(TXStatus.Confirmed, 0);
    }
    if (!data.has(TXStatus.Error)) {
      data.set(TXStatus.Error, 0);
    }
    if (!data.has(TXStatus.Pending)) {
      data.set(TXStatus.Pending, 0);
    }

    return Array.from(data, ([name, value]) => ({
      id: name,
      label: name,
      value,
      color: TX_STATUS_COLORS[name],
    }));
  };

  return (
    <>
      <Paper className={classes.paper}>
        <Grid container justify="space-between" direction="row">
          <Grid item>
            <Typography className={classes.header}>
              {t('transactions')}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.subheader}>
              {t('last24Hours')}
            </Typography>
          </Grid>
        </Grid>
        <TransactionPieChart data={mapTransactionData(transactions)} />
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
  },
  header: {
    fontWeight: 'bold',
  },
  subheader: {
    color: theme.palette.text.secondary,
    fontSize: 12,
  },
}));
