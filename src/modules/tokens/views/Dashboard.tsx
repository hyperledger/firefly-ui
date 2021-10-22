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
  Card,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import Jazzicon from 'react-jazzicon';
import { useParams } from 'react-router';
import { DataTable } from '../../../core/components/DataTable/DataTable';
import { DataTableEmptyState } from '../../../core/components/DataTable/DataTableEmptyState';
import { HashPopover } from '../../../core/components/HashPopover';
import {
  IDataTableRecord,
  ITokenPool,
  ITokenTransfer,
} from '../../../core/interfaces';
import { fetchWithCredentials, jsNumberForAddress } from '../../../core/utils';
import { useTokensTranslation } from '../registration';
import { getNumTokensInAllAccounts } from '../utils';

export const Dashboard: () => JSX.Element = () => {
  const classes = useStyles();
  const { t } = useTokensTranslation();
  const [loading, setLoading] = useState(false);
  const [connectorsTotal, setConnectorsTotal] = useState(0);
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);
  const [tokenPoolsTotal, setTokenPoolsTotal] = useState(0);
  const [transfers, setTransfers] = useState<ITokenTransfer[]>([]);
  const [transfersTotal, setTransfersTotal] = useState(0);
  const [tokensTotal, setTokensTotal] = useState(0);
  const { namespace } = useParams<{ namespace: string }>();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/tokens/connectors?count`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/tokens/pools?count`
      ),
      fetchWithCredentials(
        `/api/v1/namespaces/${namespace}/tokens/transfers?limit=5&count`
      ),
      fetchWithCredentials(`/api/v1/namespaces/${namespace}/tokens/accounts`),
    ])
      .then(
        async ([
          connectorsResponse,
          tokenPoolsResponse,
          transfersResponse,
          accountsResponse,
        ]) => {
          if (
            connectorsResponse.ok &&
            tokenPoolsResponse.ok &&
            transfersResponse.ok &&
            accountsResponse.ok
          ) {
            const connectorsJson = await connectorsResponse.json();
            const tokenPoolsJson = await tokenPoolsResponse.json();
            const transfersJson = await transfersResponse.json();
            const accountsJson = await accountsResponse.json();
            setConnectorsTotal(connectorsJson.length);
            setTokenPools(tokenPoolsJson.items);
            setTokenPoolsTotal(tokenPoolsJson.total);
            setTransfers(transfersJson.items);
            setTransfersTotal(transfersJson.total);
            setTokensTotal(getNumTokensInAllAccounts(accountsJson));
          }
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }, [namespace]);

  const summaryPanelList = [
    { data: connectorsTotal, title: 'connectors' },
    { data: tokenPoolsTotal, title: 'tokenPools' },
    { data: transfersTotal, title: 'transfers' },
    { data: tokensTotal, title: 'tokens' },
  ];

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

  const transfersColumnHeaders = [
    t('txHash'),
    t('from'),
    t('to'),
    t('timestamp'),
  ];

  const transferRecords: IDataTableRecord[] = transfers.map(
    (transfer: ITokenTransfer) => ({
      key: transfer.tx.id,
      columns: [
        {
          value: (
            <HashPopover
              shortHash={true}
              textColor="secondary"
              address={transfer.tx.id}
            />
          ),
        },
        {
          value: transfer.from ? (
            <HashPopover
              shortHash={true}
              textColor="secondary"
              address={transfer.from}
            />
          ) : (
            '---'
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              textColor="secondary"
              address={transfer.to}
            />
          ),
        },
        { value: dayjs(transfer.created).format('MM/DD/YYYY h:mm A') },
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
    <Grid container justifyContent="center">
      <Grid container item wrap="nowrap" direction="column">
        <Grid container item direction="row">
          <Grid className={classes.headerContainer} item>
            <Typography variant="h4" className={classes.header}>
              {t('dashboard')}
            </Typography>
          </Grid>
          <Box className={classes.separator} />
        </Grid>
        <Grid
          className={classes.cardContainer}
          spacing={4}
          container
          item
          direction="row"
        >
          {summaryPanelList.map((panel) => {
            return (
              <Grid xs={3} item key={panel.title}>
                {summaryPanel(t(panel.title), panel.data)}
              </Grid>
            );
          })}
        </Grid>
        <Grid container item direction="row" spacing={3}>
          <Grid container item xs={8}>
            {transfers.length ? (
              <DataTable
                minHeight="300px"
                maxHeight="calc(100vh - 340px)"
                columnHeaders={transfersColumnHeaders}
                records={transferRecords}
                header={t('latestTransfers')}
              />
            ) : (
              <DataTableEmptyState
                header={t('transfers')}
                message={t('noTokenTransfersToDisplay')}
              ></DataTableEmptyState>
            )}
          </Grid>
          <Grid container item xs={4}>
            {tokenPools.length ? (
              <Paper className={classes.paper}>
                <Grid container justifyContent="space-between" direction="row">
                  <Grid item>
                    <Typography className={classes.header}>
                      {t('pools')}
                    </Typography>
                  </Grid>
                </Grid>
                <List>
                  {tokenPools.map((tp) => {
                    return (
                      <ListItem key={tp.id}>
                        <ListItemAvatar>
                          <Jazzicon
                            diameter={34}
                            seed={jsNumberForAddress(tp.id)}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={tp.name} />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            ) : (
              <DataTableEmptyState
                header={t('pools')}
                message={t('noTokenPoolsToDisplay')}
              ></DataTableEmptyState>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    paddingBottom: theme.spacing(4),
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  content: {
    padding: theme.spacing(3),
  },
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
  },
  separator: {
    flexGrow: 1,
  },
  summaryLabel: {
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 32,
  },
}));
