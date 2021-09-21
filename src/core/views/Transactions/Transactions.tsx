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

import React, { useContext } from 'react';
import { Grid, Typography, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { DataViewSwitch } from '../../components/DataViewSwitch';
import { FilterSelect } from '../../components/FilterSelect';
import { TransactionList } from './TransactionList';
import { TransactionTimeline } from './TransactionTimeline';

export const Transactions: () => JSX.Element = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { dataView, createdFilter, setCreatedFilter } =
    useContext(ApplicationContext);

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

  return (
    <Grid container justify="center">
      <Grid
        container
        item
        wrap="nowrap"
        direction="column"
        className={classes.root}
      >
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
            <TransactionTimeline />
          </Grid>
        )}
        {dataView === 'list' && (
          <Grid container item>
            <TransactionList />
          </Grid>
        )}
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
