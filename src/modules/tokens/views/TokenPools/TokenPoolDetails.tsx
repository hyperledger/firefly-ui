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
  Link,
  List,
  Paper,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import Jazzicon from 'react-jazzicon';
import { useHistory, useParams } from 'react-router';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { HashPopover } from '../../../../core/components/HashPopover';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { ITokenPool } from '../../../../core/interfaces';
import {
  fetchWithCredentials,
  jsNumberForAddress,
} from '../../../../core/utils';
import { useTokensTranslation } from '../../registration';

export const TokenPoolDetails: () => JSX.Element = () => {
  const history = useHistory();
  const { t } = useTokensTranslation();
  const { name } = useParams<{ name: string }>();
  const classes = useStyles();
  const { selectedNamespace } = useContext(NamespaceContext);
  const [loading, setLoading] = useState(false);
  const [tokenPool, setTokenPool] = useState<ITokenPool>();

  useEffect(() => {
    setLoading(true);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/tokens/pools/${name}`
    )
      .then(async (tokenPoolResponse) => {
        if (tokenPoolResponse.ok) {
          setTokenPool(await tokenPoolResponse.json());
        } else {
          console.log('error fetching token pool');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace, name]);

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tokenPool) {
    return <></>;
  }

  const detailsData = [
    {
      label: t('id'),
      value: <HashPopover address={tokenPool.id}></HashPopover>,
    },
    { label: t('type'), value: t(tokenPool.type) },
    { label: t('namespace'), value: tokenPool.namespace },
    { label: t('name'), value: tokenPool.name },
    { label: t('protocolID'), value: tokenPool.protocolId },
    {
      label: t('key'),
      value: <HashPopover address={tokenPool.key}></HashPopover>,
    },
    { label: t('connector'), value: tokenPool.connector },
  ];

  const messageData = [
    {
      label: t('created'),
      value: dayjs(tokenPool.created).format('MM/DD/YYYY h:mm A'),
    },
    {
      label: t('type'),
      value: t('tokenPool'),
    },
    {
      label: t('id'),
      value: <HashPopover address={tokenPool.id}></HashPopover>,
    },
    {
      label: t('message'),
      value: <HashPopover address={tokenPool.message}></HashPopover>,
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
              onClick={() => history.goBack()}
            >
              {t('tokenPools')}
            </Link>
            <Link underline="none" color="text.primary">
              {tokenPool.name}
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
          <div className={classes.paddingRight}>
            <Jazzicon diameter={34} seed={jsNumberForAddress(tokenPool.id)} />
          </div>
          <Typography className={classes.bold} variant="h4">
            {tokenPool.name}
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
                      <>
                        <Grid item xs={4}>
                          <Typography color="text.secondary" variant="body1">
                            {data.label}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography>{data.value}</Typography>
                        </Grid>
                      </>
                    );
                  })}
                </Grid>
              </List>
            </Paper>
          </Grid>
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
                  {messageData.map((data) => {
                    return (
                      <>
                        <Grid item xs={4}>
                          <Typography color="text.secondary" variant="body1">
                            {data.label}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography>{data.value}</Typography>
                        </Grid>
                      </>
                    );
                  })}
                </Grid>
              </List>
            </Paper>
          </Grid>
          <Grid container item>
            {/* TODO: Add transfer table once API call is fleshed out */}
            <DataTableEmptyState
              message={t('noTokenTransfersToDisplay')}
            ></DataTableEmptyState>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
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
  content: {
    padding: theme.spacing(3),
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
}));
