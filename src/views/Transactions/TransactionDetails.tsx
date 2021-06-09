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
import { useHistory, useParams } from 'react-router-dom';
import { ITransaction } from '../../interfaces';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { useTranslation } from 'react-i18next';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import { HashPopover } from '../../components/HashPopover';
import { StatusChip } from '../../components/StatusChip';
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';

export const TransactionDetails: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(NamespaceContext);
  const [transaction, setTransaction] = useState<ITransaction>();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const detailItem = (label: string, value: string | JSX.Element) => (
    <>
      <Grid className={classes.gridPadding} item xs={12}>
        <Typography className={classes.detailLabel}>{label}</Typography>
      </Grid>
      <Grid item xs={12}>
        {value}
      </Grid>
    </>
  );

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/namespaces/${selectedNamespace}/transactions/${id}`)
      .then(async (response) => {
        if (response.ok) {
          setTransaction(await response.json());
        } else {
          console.log(`error loading transaction ${id}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace, id]);

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  if (!transaction) {
    return <></>;
  }

  return (
    <>
      <Grid container wrap="nowrap" direction="column" className={classes.root}>
        <Grid item>
          <Button
            className={classes.backButton}
            startIcon={<ChevronLeftIcon />}
            onClick={() => history.goBack()}
          >
            {t('back')}
          </Button>
        </Grid>
        <Grid item className={classes.paddingBottom}>
          <Typography className={classes.bold} variant="h4">
            {t('transactionDetails')}
          </Typography>
        </Grid>
        <Grid item className={classes.paddingBottom}>
          <Typography className={classes.bold}>{transaction.hash}</Typography>
        </Grid>
        <Grid container spacing={4} item direction="row">
          <Grid item xs={6}>
            <Card>
              <CardContent className={classes.content}>
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'hash',
                    <HashPopover
                      textColor="secondary"
                      address={transaction.hash}
                    />
                  )}
                </Grid>
                {transaction.info?.blockNumber && (
                  <Grid className={classes.detailGrid} item>
                    {detailItem(
                      'Block',
                      <Typography className={classes.detailValue}>
                        {transaction.info.blockNumber}
                      </Typography>
                    )}
                  </Grid>
                )}
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'From',
                    <HashPopover
                      textColor="secondary"
                      address={transaction.subject.signer}
                    />
                  )}
                </Grid>
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'Status',
                    <StatusChip status={transaction.status} />
                  )}
                </Grid>
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'Timestamp',
                    <Typography className={classes.detailValue}>
                      {transaction.created}
                    </Typography>
                  )}
                </Grid>
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'sequence',
                    <Typography className={classes.detailValue}>
                      {transaction.sequence}
                    </Typography>
                  )}
                </Grid>
                {transaction.info?.signature && (
                  <Grid className={classes.detailGrid} item>
                    {detailItem(
                      'methods',
                      <Typography className={classes.detailValue}>
                        {transaction.info.signature}
                      </Typography>
                    )}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent className={classes.content}>
                {transaction.info?.address && (
                  <Grid className={classes.detailGrid} item>
                    {detailItem(
                      'address',
                      <Typography className={classes.detailValue}>
                        {transaction.info.address}
                      </Typography>
                    )}
                  </Grid>
                )}
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'type',
                    <Typography className={classes.detailValue}>
                      {transaction.subject.type}
                    </Typography>
                  )}
                </Grid>
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'namespace',
                    <Typography className={classes.detailValue}>
                      {transaction.subject.namespace}
                    </Typography>
                  )}
                </Grid>
                <Grid className={classes.detailGrid} item>
                  {detailItem(
                    'reference',
                    <Typography className={classes.detailValue}>
                      {transaction.subject.reference}
                    </Typography>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
  bold: {
    fontWeight: 'bold',
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  backButton: {
    color: theme.palette.text.secondary,
    textTransform: 'capitalize',
    paddingLeft: 0,
  },
  paddingBottom: {
    paddingBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(3),
  },
  detailLabel: {
    fontSize: 10,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: theme.palette.text.secondary,
  },
  detailGrid: {
    padding: theme.spacing(1),
  },
  gridPadding: {
    paddingBottom: theme.spacing(1),
  },
}));
