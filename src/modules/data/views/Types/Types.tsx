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
  CircularProgress,
  Grid,
  TablePagination,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { ArrayParam, useQueryParam, withDefault } from 'use-query-params';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { FilterDisplay } from '../../../../core/components/FilterDisplay';
import { FilterModal } from '../../../../core/components/FilterModal';
import { HashPopover } from '../../../../core/components/HashPopover';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import {
  ICreatedFilter,
  IDataTableRecord,
  IDataType,
} from '../../../../core/interfaces';
import { fetchWithCredentials, getCreatedFilter } from '../../../../core/utils';
import { useDataTranslation } from '../../registration';
import { DatePicker } from '../../../../core/components/DatePicker';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { SnackbarContext } from '../../../../core/contexts/SnackbarContext';

const PAGE_LIMITS = [10, 25];

export const Types: () => JSX.Element = () => {
  const { t } = useDataTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dataTypeItems, setDataTypeItems] = useState<IDataType[]>([]);
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
    t('hash'),
    t('name'),
    t('message'),
    t('version'),
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

  useEffect(() => {
    setLoading(true);
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/datatypes?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterObject.filterString}${
        filterString !== undefined ? filterString : ''
      }`
    )
      .then(async (response) => {
        if (response.ok) {
          const dataTypes: IDataType[] = await response.json();
          setDataTypeItems(dataTypes);
        } else {
          reportFetchError(response);
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

  const records: IDataTableRecord[] = dataTypeItems.map((data: IDataType) => ({
    key: data.id,
    columns: [
      {
        value: (
          <HashPopover
            textColor="secondary"
            shortHash={true}
            address={data.hash}
          />
        ),
      },
      {
        value: data.name,
      },
      {
        value: (
          <HashPopover
            textColor="secondary"
            shortHash={true}
            address={data.message}
          />
        ),
      },
      {
        value: data.version,
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
                {t('dataTypes')}
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
          <Grid container item className={classes.spacing}>
            {records.length ? (
              <DataTable
                stickyHeader={true}
                minHeight="300px"
                maxHeight="calc(100vh - 340px)"
                columnHeaders={columnHeaders}
                records={records}
                {...{ pagination }}
              />
            ) : (
              <>
                <DataTableEmptyState
                  message={t('noDataTypesToDisplay')}
                ></DataTableEmptyState>
              </>
            )}
          </Grid>
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
  filterContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  spacing: {
    paddingTop: theme.spacing(4),
  },
  filterButton: {
    height: 40,
  },
}));
