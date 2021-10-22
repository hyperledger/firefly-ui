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
  CircularProgress,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import Jazzicon from 'react-jazzicon';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { HashPopover } from '../../../../core/components/HashPopover';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { IDataTableRecord, ITokenPool } from '../../../../core/interfaces';
import {
  fetchWithCredentials,
  jsNumberForAddress,
} from '../../../../core/utils';
import { useTokensTranslation } from '../../registration';

export const TokenPools: () => JSX.Element = () => {
  const classes = useStyles();
  const { t } = useTokensTranslation();
  const [loading, setLoading] = useState(false);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [tokenPools, setTokenPools] = useState<ITokenPool[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchWithCredentials(`/api/v1/namespaces/${selectedNamespace}/tokens/pools`)
      .then(async (tokenPoolsResponse) => {
        if (tokenPoolsResponse.ok) {
          setTokenPools(await tokenPoolsResponse.json());
        } else {
          console.log('error fetching token pools');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedNamespace]);

  const tokenPoolsColumnHeaders = [
    t('name'),
    t('address'),
    t('type'),
    t('connector'),
    t('protocolID'),
    t('lastUpdated'),
  ];

  const tokenPoolsRecords: IDataTableRecord[] = tokenPools.map(
    (tokenPool: ITokenPool) => ({
      key: tokenPool.id,
      columns: [
        {
          value: (
            <ListItem>
              <ListItemAvatar>
                <Jazzicon
                  diameter={34}
                  seed={jsNumberForAddress(tokenPool.id)}
                />
              </ListItemAvatar>
              <ListItemText primary={tokenPool.name} />
            </ListItem>
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              textColor="secondary"
              address={tokenPool.key}
            />
          ),
        },
        {
          value: t(tokenPool.type),
        },
        {
          value: tokenPool.connector,
        },
        {
          value: tokenPool.protocolId,
        },
        { value: dayjs(tokenPool.created).format('MM/DD/YYYY h:mm A') },
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
              {t('tokenPools')}
            </Typography>
          </Grid>
          <Box className={classes.separator} />
        </Grid>
        <Grid container item>
          {tokenPools.length ? (
            <DataTable
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              columnHeaders={tokenPoolsColumnHeaders}
              records={tokenPoolsRecords}
            />
          ) : (
            <DataTableEmptyState
              message={t('noTokenPoolsToDisplay')}
            ></DataTableEmptyState>
          )}
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
