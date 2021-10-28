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

import React, { useState, useContext, useEffect } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { IMessage, IHistory } from '../../../../core/interfaces';
import { MessageDetails } from './MessageDetails';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { DataViewSwitch } from '../../../../core/components/DataViewSwitch';
import { useHistory } from 'react-router-dom';
import { MessageTimeline } from './MessageTimeline';
import { MessageList } from './MessageList';
import { FilterSelect } from '../../../../core/components/FilterSelect';
import { FilterModal } from '../../../../core/components/FilterModal';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { useDataTranslation } from '../../registration';
import { FilterDisplay } from '../../../../core/components/FilterDisplay';
import { ArrayParam, withDefault, useQueryParam } from 'use-query-params';
import { filterOperators } from '../../../../core/utils';

export const Messages: () => JSX.Element = () => {
  const { t } = useDataTranslation();
  const classes = useStyles();
  const history = useHistory<IHistory>();
  const [viewMessage, setViewMessage] = useState<IMessage | undefined>();
  const { dataView, createdFilter, setCreatedFilter } =
    useContext(ApplicationContext);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterString, setFilterString] = useState('');
  const [filterQuery, setFilterQuery] = useQueryParam(
    'filters',
    withDefault(ArrayParam, [])
  );

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

  // make sure to view MessageDetails panel if it was open when navigating to a linked page and user goes back
  if (history.location.state && !viewMessage) {
    setViewMessage(history.location.state.viewMessage);
  }

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
    setFilterQuery(activeFilters);
    if (activeFilters.length === 0) {
      setFilterString('');
      return;
    }

    setFilterString(`&${activeFilters.join('&')}`);
  }, [activeFilters, setFilterQuery]);

  const filterFields = [
    'author',
    'batch',
    'cid',
    'confirmed',
    'created',
    'group',
    'hash',
    'id',
    'key',
    'local',
    'namespace',
    'pending',
    'pins',
    'rejected',
    'sequence',
    'tag',
    'topics',
    'txtype',
    'type',
  ];

  return (
    <>
      <Grid container justifyContent="center">
        <Grid container wrap="nowrap" direction="column">
          <Grid container spacing={2} item direction="row" alignItems="center">
            <Grid item>
              <Typography className={classes.bold} variant="h4">
                {t('messages')}
              </Typography>
            </Grid>
            <Box className={classes.separator} />
            <Grid item>
              <Button variant="outlined" onClick={handleOpenFilter}>
                <Typography>{t('filter')}</Typography>
              </Button>
            </Grid>
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
              <MessageTimeline
                filterString={filterString}
                {...{ setViewMessage }}
              />
            </Grid>
          )}
          {dataView === 'list' && (
            <Grid container item>
              <MessageList
                filterString={filterString}
                {...{ setViewMessage }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      {viewMessage && (
        <MessageDetails
          open={!!viewMessage}
          message={viewMessage}
          onClose={() => {
            setViewMessage(undefined);
            history.replace(
              `/namespace/${selectedNamespace}/data/messages` +
                history.location.search,
              undefined
            );
          }}
        />
      )}
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={filterFields}
          operators={filterOperators}
          addFilter={handleAddFilter}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  bold: {
    fontWeight: 'bold',
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
}));
