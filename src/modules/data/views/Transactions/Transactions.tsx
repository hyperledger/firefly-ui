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

import React, { useContext, useState, useEffect } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { DataViewSwitch } from '../../../../core/components/DataViewSwitch';
import { TransactionList } from './TransactionList';
import { TransactionTimeline } from './TransactionTimeline';
import { useDataTranslation } from '../../registration';
import { FilterDisplay } from '../../../../core/components/FilterDisplay';
import { ArrayParam, withDefault, useQueryParam } from 'use-query-params';
import { FilterModal } from '../../../../core/components/FilterModal';
import { DatePicker } from '../../../../core/components/DatePicker';
import { ITransaction } from '../../../../core/interfaces';
import { TransactionDetails } from './TransactionDetails';

export const Transactions: () => JSX.Element = () => {
  const { t } = useDataTranslation();
  const classes = useStyles();
  const { dataView } = useContext(ApplicationContext);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterString, setFilterString] = useState('');
  const [filterQuery, setFilterQuery] = useQueryParam(
    'filters',
    withDefault(ArrayParam, [])
  );
  const [detailsTx, setDetailsTx] = useState<ITransaction | undefined>();
  const filterFields = ['created', 'id', 'namespace', 'status', 'type'];

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleAddFilter = (filter: string) => {
    setActiveFilters((activeFilters) => [...activeFilters, filter]);
  };

  useEffect(() => {
    // set filters if they are present in the URL
    if (filterQuery.length !== 0) {
      setActiveFilters(filterQuery as string[]);
    }
  }, [setActiveFilters, filterQuery]);

  useEffect(() => {
    //set query param state
    setFilterQuery(activeFilters, 'replaceIn');
    if (activeFilters.length === 0) {
      setFilterString('');
      return;
    }

    setFilterString(`&${activeFilters.join('&')}`);
  }, [activeFilters, setFilterQuery]);

  return (
    <>
      <Grid container justifyContent="center">
        <Grid container item wrap="nowrap" direction="column">
          <Grid container spacing={2} item direction="row">
            <Grid item>
              <Typography className={classes.header} variant="h4">
                {t('transactions')}
              </Typography>
            </Grid>
            <Box className={classes.separator} />
            <Grid item>
              <Button
                className={classes.filterButton}
                variant="outlined"
                onClick={handleOpenFilter}
              >
                <Typography>{t('filter')}</Typography>
              </Button>
            </Grid>
            <Grid item>
              <DatePicker />
            </Grid>
            <Grid item>
              <DataViewSwitch />
            </Grid>
          </Grid>
          {activeFilters.length > 0 && (
            <Grid container className={classes.filterContainer}>
              <FilterDisplay
                filters={activeFilters}
                setFilters={setActiveFilters}
              />
            </Grid>
          )}
          {dataView === 'timeline' && (
            <Grid className={classes.timelineContainer} xs={12} container item>
              <TransactionTimeline
                {...{ setDetailsTx }}
                filterString={filterString}
              />
            </Grid>
          )}
          {dataView === 'list' && (
            <Grid container item>
              <TransactionList
                {...{ setDetailsTx }}
                filterString={filterString}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={filterFields}
          addFilter={handleAddFilter}
        />
      )}
      {detailsTx && (
        <TransactionDetails
          open={!!detailsTx}
          onClose={() => {
            setDetailsTx(undefined);
          }}
          data={detailsTx}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
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
  filterContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  filterButton: {
    height: 40,
  },
}));
