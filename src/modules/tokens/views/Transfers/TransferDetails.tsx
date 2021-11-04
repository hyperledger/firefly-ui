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
  IconButton,
  Link,
  List,
  Paper,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { HashPopover } from '../../../../core/components/HashPopover';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { ITokenPool, ITokenTransfer } from '../../../../core/interfaces';
import { fetchWithCredentials } from '../../../../core/utils';
import { useTokensTranslation } from '../../registration';
import LaunchIcon from '@mui/icons-material/Launch';

const NO_MESSAGE =
  '0000000000000000000000000000000000000000000000000000000000000000';

export const TransferDetails: () => JSX.Element = () => {
  const history = useHistory();
  const { t } = useTokensTranslation();
  const { id } = useParams<{ id: string }>();
  const classes = useStyles();
  const { selectedNamespace } = useContext(NamespaceContext);
  const [loading, setLoading] = useState(false);
  const [tokenTransfer, setTokenTransfer] = useState<ITokenTransfer>();
  const [tokenPool, setTokenPool] = useState<ITokenPool>();
  const [messageID, setMessageID] = useState<string>();

  useEffect(() => {
    setLoading(true);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/tokens/transfers/${id}`
    )
      .then(async (tokenTransferResponse) => {
        if (tokenTransferResponse.ok) {
          const transfer: ITokenTransfer = await tokenTransferResponse.json();
          setTokenTransfer(transfer);

          const [pool, messageID] = await Promise.all([
            fetchPoolDetails(selectedNamespace, transfer.pool),
            fetchMessageID(selectedNamespace, transfer.messageHash),
          ]);
          if (pool !== undefined) {
            setTokenPool(pool);
          }
          if (messageID !== undefined) {
            setMessageID(messageID);
          }
        } else {
          console.log('error fetching token transfer');
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

  if (!tokenTransfer) {
    return <></>;
  }

  const detailsData = [
    {
      label: t('type'),
      value: t(tokenTransfer.type),
    },
    {
      label: t('localID'),
      value: <HashPopover address={tokenTransfer.localId}></HashPopover>,
    },
    {
      label: t('poolID'),
      value: <HashPopover address={tokenTransfer.pool}></HashPopover>,
    },
    {
      label: t('name'),
      value: tokenPool?.name,
    },
    {
      label: t('connector'),
      value: tokenPool?.connector,
    },
    {
      label: t('standard'),
      value: tokenPool?.standard,
    },
    {
      label: t('key'),
      value: <HashPopover address={tokenTransfer.key}></HashPopover>,
    },
    {
      label: t('from'),
      value: tokenTransfer.from ? (
        <>
          <HashPopover address={tokenTransfer.from}></HashPopover>
          <IconButton
            className={classes.button}
            size="large"
            onClick={() => {
              history.push(
                `/namespace/${selectedNamespace}/tokens/accounts/${tokenTransfer.from}/${tokenPool?.name}`
              );
            }}
          >
            <LaunchIcon />
          </IconButton>
        </>
      ) : (
        t('emptyPlaceholder')
      ),
    },
    {
      label: t('to'),
      value: tokenTransfer.to ? (
        <>
          <HashPopover address={tokenTransfer.to}></HashPopover>
          <IconButton
            className={classes.button}
            size="large"
            onClick={() => {
              history.push(
                `/namespace/${selectedNamespace}/tokens/accounts/${tokenTransfer.to}/${tokenPool?.name}`
              );
            }}
          >
            <LaunchIcon />
          </IconButton>
        </>
      ) : (
        t('emptyPlaceholder')
      ),
    },
    {
      label: t('tokenIndex'),
      value: tokenTransfer.tokenIndex
        ? tokenTransfer.tokenIndex
        : t('emptyPlaceholder'),
    },
    { label: t('amount'), value: t(tokenTransfer.amount) },
    {
      label: t('protocolID'),
      value: <HashPopover address={tokenTransfer.protocolId}></HashPopover>,
    },
    {
      label: t('created'),
      value: dayjs(tokenTransfer.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  const messageData = [
    {
      label: t('hash'),
      value: <HashPopover address={tokenTransfer.messageHash}></HashPopover>,
    },
    {
      label: t('id'),
      value: messageID && (
        <>
          <HashPopover address={messageID}></HashPopover>
          <IconButton className={classes.button} size="large">
            <LaunchIcon />
          </IconButton>
        </>
      ),
    },
  ];

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
                history.push(
                  `/namespace/${selectedNamespace}/tokens/transfers/`
                )
              }
            >
              {t('tokenTransfers')}
            </Link>
            <Link underline="none" color="text.primary">
              {t('transferDetails')}
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
            {t('transferDetails')}
          </Typography>
        </Grid>
        <Grid container spacing={4} item direction="row">
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid
                container
                justifyContent="space-between"
                direction="row"
                className={classes.paddingBottom}
              >
                <Grid item>
                  <Typography className={classes.header}>
                    {t('details')}
                  </Typography>
                </Grid>
              </Grid>
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
          {messageID && (
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Grid
                  container
                  justifyContent="space-between"
                  direction="row"
                  className={classes.paddingBottom}
                >
                  <Grid item>
                    <Typography className={classes.header}>
                      {t('message')}
                    </Typography>
                  </Grid>
                </Grid>
                <List>
                  <Grid container spacing={2}>
                    {messageData.map((data) => {
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
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

const fetchPoolDetails = async (
  namespace: string,
  id: string
): Promise<ITokenPool | undefined> => {
  const response = await fetchWithCredentials(
    `/api/v1/namespaces/${namespace}/tokens/pools/${id}`
  );
  if (response.ok) {
    return response.json();
  }
  console.log('error fetching token pool');
  return undefined;
};

const fetchMessageID = async (
  namespace: string,
  hash: string
): Promise<string | undefined> => {
  if (hash === NO_MESSAGE) {
    return undefined;
  }
  const messageResponse = await fetchWithCredentials(
    `/api/v1/namespaces/${namespace}/messages?hash=${hash}`
  );
  if (messageResponse.ok) {
    const messages = await messageResponse.json();
    if (messages.length > 0) {
      return messages[0].header.id;
    }
  }
  console.log('error fetching transfer message');
  return undefined;
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
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
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
  button: {
    color: theme.palette.text.primary,
    padding: 0,
    paddingLeft: theme.spacing(1),
  },
}));
