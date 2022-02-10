// Copyright © 2022 Kaleido, Inc.
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

import React, { useContext, useEffect, useState } from 'react';
import { DisplaySlide } from '../../../../core/components/Display/DisplaySlide';
import { Typography, Grid, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ITransaction, ITransactionStatus } from '../../../../core/interfaces';
import { useDataTranslation } from '../../registration';
import { HashPopover } from '../../../../core/components/HashPopover';
import dayjs from 'dayjs';
import { TransactionStatus } from '../../../../core/components/TransactionStatus';
import { fetchWithCredentials } from '../../../../core/utils';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';

interface Props {
  data: ITransaction;
  open: boolean;
  onClose: () => void;
}

export const TransactionDetails: React.FC<Props> = ({
  data,
  open,
  onClose,
}) => {
  const { t } = useDataTranslation();
  const [status, setStatus] = useState<ITransactionStatus | undefined>();
  const { selectedNamespace } = useContext(NamespaceContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/transactions/${data.id}/status`
    )
      .then(async (response) => {
        if (response.ok) {
          setStatus(await response.json());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace, data.id]);

  const detailItem = (label: string, value: string | JSX.Element | number) => (
    <>
      <Grid item xs={4}>
        <Typography className={classes.detailLabel}>{label}</Typography>
      </Grid>
      <Grid item xs={8}>
        {value}
      </Grid>
    </>
  );

  const renderStatus = () => {
    if (status) {
      return (
        <Grid container className={classes.detailsContainer}>
          <Grid item xs={12}>
            <TransactionStatus {...{ status }} />
          </Grid>
        </Grid>
      );
    }
  };

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column">
          <Grid className={classes.headerContainer} item>
            <Typography className={classes.header}>
              {t('transactionDetails')}
            </Typography>
          </Grid>
          <Grid container className={classes.detailsContainer} spacing={3} item>
            <Grid xs={12} container item alignItems="center">
              {detailItem(t('id'), <HashPopover address={data.id} />)}
            </Grid>
            <Grid xs={12} container item alignItems="center">
              {detailItem(t('type'), data.type)}
            </Grid>
            {status && (
              <Grid xs={12} container item alignItems="center">
                {detailItem(t('status'), status.status)}
              </Grid>
            )}
            <Grid xs={12} container item alignItems="center">
              {detailItem(
                t('created'),
                dayjs(data.created).format('MM/DD/YYYY h:mm A')
              )}
            </Grid>
          </Grid>
        </Grid>
        {loading ? <CircularProgress /> : renderStatus()}
      </DisplaySlide>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  detailsContainer: {
    padding: theme.spacing(3),
  },
  detailItem: {
    paddingBottom: theme.spacing(1),
  },
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  detailLabel: {
    fontSize: 10,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
  },
  divider: {
    backgroundColor: theme.palette.background.default,
    height: 2,
  },
  copyButton: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: 20,
    fontSize: 10,
  },
  paddingRight: {
    paddingRight: theme.spacing(1),
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    minWidth: '40vw',
  },
}));
