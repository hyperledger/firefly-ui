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

import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  Card,
  CardContent,
  Box,
} from '@material-ui/core';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import {
  IDataTableRecord,
  IMessage,
  ITransaction,
} from '../../../core/interfaces';
import { DataTable } from '../../../core/components/DataTable/DataTable';
import { HashPopover } from '../../../core/components/HashPopover';
import { ApplicationContext } from '../../../core/contexts/ApplicationContext';
import { RecentTransactions } from '../../../core/components/RecentTransactions/RecentTransactions';
import { FilterSelect } from '../../../core/components/FilterSelect';
import { fetchWithCredentials } from '../../../core/utils';
import { useDataTranslation } from '../translations/translations';

export const Dashboard: () => JSX.Element = () => {
  const classes = useStyles();
  const { t } = useDataTranslation();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageTotal, setMessageTotal] = useState(0);
  const [orgTotal, setOrgTotal] = useState(0);
  const [dataTotal, setDataTotal] = useState(0);
  const [txTotal, setTxTotal] = useState(0);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const { lastEvent, createdFilter, setCreatedFilter } =
    useContext(ApplicationContext);
  const { namespace } = useParams<{ namespace: string }>();

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

    Promise.all([
      fetchWithCredentials(`/api/v1/network/organizations?count&created=>=0`),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/data?count${createdFilterString}`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/messages?limit=5&count${createdFilterString}`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/transactions?limit=50&count&created=>=${dayjs()
          .subtract(24, 'hours')
          .unix()}${createdFilterString}`
      ),
    ]).then(
      async ([orgResponse, dataResponse, messageResponse, txResponse]) => {
        if (
          orgResponse.ok &&
          dataResponse.ok &&
          messageResponse.ok &&
          txResponse.ok
        ) {
          const messageJson = await messageResponse.json();
          const dataJson = await dataResponse.json();
          const txJson = await txResponse.json();
          const orgJson = await orgResponse.json();
          setMessageTotal(messageJson.total);
          setDataTotal(dataJson.total);
          setTxTotal(txJson.total);
          setOrgTotal(orgJson.total);
          setMessages(messageJson.items);
          setTransactions(txJson.items);
        }
      }
    );
  }, [namespace, lastEvent, createdFilter]);

  const summaryPanel = (label: string, value: string | number) => (
    <Card>
      <CardContent className={classes.content}>
        <Typography noWrap className={classes.summaryLabel}>
          {label}
        </Typography>
        <Typography noWrap className={classes.summaryValue}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const messageColumnHeaders = [
    t('author'),
    t('type'),
    t('dataHash'),
    t('createdOn'),
  ];

  const messageRecords: IDataTableRecord[] = messages.map(
    (message: IMessage) => ({
      key: message.header.id,
      columns: [
        {
          value: (
            <HashPopover
              textColor="secondary"
              address={message.header.author}
            />
          ),
        },
        {
          value: message.header.type,
        },
        {
          value: (
            <HashPopover
              textColor="secondary"
              address={message.header.datahash}
            />
          ),
        },
        {
          value: dayjs(message.header.created).format('MM/DD/YYYY h:mm A'),
        },
      ],
    })
  );

  return (
    <Grid container justify="center">
      <Grid
        container
        item
        wrap="nowrap"
        className={classes.root}
        direction="column"
      >
        <Grid container item direction="row">
          <Grid className={classes.headerContainer} item>
            <Typography variant="h4" className={classes.header}>
              {t('explorer')}
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
        </Grid>
        <Grid
          className={classes.cardContainer}
          spacing={4}
          container
          item
          direction="row"
        >
          <Grid xs={3} item>
            {summaryPanel(t('networkMembers'), orgTotal)}
          </Grid>
          <Grid xs={3} item>
            {summaryPanel(t('messages'), messageTotal)}
          </Grid>
          <Grid xs={3} item>
            {summaryPanel(t('transactions'), txTotal)}
          </Grid>
          <Grid xs={3} item>
            {summaryPanel(t('data'), dataTotal)}
          </Grid>
        </Grid>
        <Grid container item direction="row" spacing={6}>
          <Grid container item xs={7}>
            <DataTable
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              columnHeaders={messageColumnHeaders}
              records={messageRecords}
              header={t('latestMessages')}
            />
          </Grid>
          <Grid container item xs={5}>
            <RecentTransactions transactions={transactions} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 20,
    paddingLeft: 120,
    paddingRight: 120,
    maxWidth: 1920,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  summaryLabel: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 32,
  },
  content: {
    padding: theme.spacing(3),
  },
  cardContainer: {
    paddingBottom: theme.spacing(4),
  },
  separator: {
    flexGrow: 1,
  },
}));
