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
  Button,
  Card,
  CircularProgress,
  Grid,
  TablePagination,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { ArrayParam, useQueryParam, withDefault } from 'use-query-params';
import { Histogram } from '../../../../core/components/Charts/Histogram';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { DatePicker } from '../../../../core/components/DatePicker';
import { FilterDisplay } from '../../../../core/components/FilterDisplay';
import { FilterModal } from '../../../../core/components/FilterModal';
import { HashPopover } from '../../../../core/components/HashPopover';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { SnackbarContext } from '../../../../core/contexts/SnackbarContext';
import {
  FFColors,
  ICreatedFilter,
  IDataTableRecord,
  IEvent,
  IMetric,
} from '../../../../core/interfaces';
import { fetchWithCredentials, getCreatedFilter } from '../../../../core/utils';
import { useDataTranslation } from '../../registration';

const PAGE_LIMITS = [10, 25];

export const Events: () => JSX.Element = () => {
  const { t } = useDataTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [eventItems, setEventItems] = useState<IEvent[]>([]);
  const [eventMetrics, setEventMetrics] = useState<IMetric[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const { createdFilter, lastEvent } = useContext(ApplicationContext);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filterString, setFilterString] = useState('');
  const [filterQuery, setFilterQuery] = useQueryParam(
    'filters',
    withDefault(ArrayParam, [])
  );
  const { reportFetchError } = useContext(SnackbarContext);

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

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleAddFilter = (filter: string) => {
    setActiveFilters((activeFilters) => [...activeFilters, filter]);
  };

  const filterFields = [
    'blob.hash',
    'blob.public',
    'created',
    'datatype.name',
    'datatype.version',
    'hash',
    'id',
    'key',
    'namespace',
    'validator',
  ];

  const columnHeaders = [
    t('id'),
    t('sequence'),
    t('type'),
    t('reference'),
    t('timestamp'),
  ];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPage(0);
    setRowsPerPage(+event.target.value);
  };

  const pagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={currentPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      className={classes.pagination}
    />
  );

  // Table
  useEffect(() => {
    setLoading(true);
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/events?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterObject.filterString}${
        filterString !== undefined ? filterString : ''
      }`
    )
      .then(async (eventsResponse) => {
        if (eventsResponse.ok) {
          const eventsJson: IEvent[] = await eventsResponse.json();
          setEventItems(eventsJson);
        } else {
          reportFetchError(eventsResponse);
        }
      })
      .catch((err) => reportFetchError(err))
      .finally(() => {
        setLoading(false);
      });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    createdFilter,
    lastEvent,
    filterString,
    reportFetchError,
  ]);

  // Chart
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/charts/histogram/events?startTime=${createdFilterObject.filterTime}&endTime=${currentTime}&buckets=100`
    )
      .then(async (eventsMetricsResponse) => {
        if (eventsMetricsResponse.ok) {
          const eventsMetricsJson: IMetric[] =
            await eventsMetricsResponse.json();
          setEventMetrics(eventsMetricsJson);
        } else {
          reportFetchError(eventsMetricsResponse);
        }
      })
      .catch((err) => reportFetchError(err));
  }, [selectedNamespace, createdFilter, reportFetchError]);

  const records: IDataTableRecord[] = eventItems.map((data: IEvent) => ({
    key: data.id,
    columns: [
      {
        value: (
          <HashPopover
            textColor="secondary"
            shortHash={true}
            address={data.id}
          />
        ),
      },
      { value: data.sequence || t('emptyPlaceholder') },
      {
        value: data.type,
      },
      {
        value: data.reference ? (
          <HashPopover
            textColor="secondary"
            shortHash={true}
            address={data.reference}
          />
        ) : (
          t('emptyPlaceholder')
        ),
      },
      { value: dayjs(data.created).format('MM/DD/YYYY h:mm A') },
    ],
  }));

  if (loading) {
    return (
      <Box className={classes.centeredContent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container justifyContent="center">
        <Grid container wrap="nowrap" direction="column">
          <Grid container spacing={2} item direction="row">
            <Grid item>
              <Typography className={classes.header} variant="h4">
                {t('events')}
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
          </Grid>
          {activeFilters.length > 0 && (
            <Grid container className={classes.filterContainer}>
              <FilterDisplay
                filters={activeFilters}
                setFilters={setActiveFilters}
              />
            </Grid>
          )}

          {records.length ? (
            <>
              <Grid className={classes.cardContainer} container>
                <Card sx={{ height: '200px', width: '100%' }}>
                  {eventMetrics?.find((m) => m.count !== '0') && (
                    <Histogram
                      colors={[FFColors.Blue]}
                      data={eventMetrics}
                      indexBy={'timestamp'}
                      keys={['count']}
                      xAxisTitle={''}
                      yAxisTitle={''}
                    />
                  )}
                </Card>
              </Grid>
              <Grid container item>
                <DataTable
                  stickyHeader={true}
                  minHeight="300px"
                  maxHeight="calc(100vh - 340px)"
                  columnHeaders={columnHeaders}
                  records={records}
                  {...{ pagination }}
                />
              </Grid>
            </>
          ) : (
            <Grid container item className={classes.spacing}>
              <DataTableEmptyState
                message={t('noEventsToDisplay')}
              ></DataTableEmptyState>
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
  cardContainer: {
    paddingTop: theme.spacing(4),
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
  separator: {
    flexGrow: 1,
  },
  spacing: {
    paddingTop: theme.spacing(4),
  },
  filterContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  filterButton: {
    height: 40,
  },
}));
