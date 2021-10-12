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
import {
  Grid,
  Typography,
  TablePagination,
  CircularProgress,
  Box,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import dayjs from 'dayjs';
import { IDataTableRecord, IData } from '../../../../core/interfaces';
import { DataTable } from '../../../../core/components/DataTable/DataTable';
import { HashPopover } from '../../../../core/components/HashPopover';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { FilterSelect } from '../../../../core/components/FilterSelect';
import { DataDetails } from './DataDetails';
import { fetchWithCredentials } from '../../../../core/utils';
import { useDataTranslation } from '../../registration';

const PAGE_LIMITS = [10, 25];

export const Data: () => JSX.Element = () => {
  const { t } = useDataTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [dataItems, setDataItems] = useState<IData[]>([]);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const [viewData, setViewData] = useState<IData | undefined>();
  const { createdFilter, setCreatedFilter, lastEvent } =
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

  const columnHeaders = [
    t('id'),
    t('validator'),
    t('dataHash'),
    t('createdOn'),
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
    let createdFilterString = `&created=>=${dayjs()
      .subtract(24, 'hours')
      .unix()}`;
    if (createdFilter === '30days') {
      createdFilterString = `&created=>=${dayjs().subtract(30, 'days').unix()}`;
    }
    if (createdFilter === '7days') {
      createdFilterString = `&created=>=${dayjs().subtract(7, 'days').unix()}`;
    }

    fetchWithCredentials(
      `/api/v1/namespaces/${selectedNamespace}/data?limit=${rowsPerPage}&skip=${
        rowsPerPage * currentPage
      }${createdFilterString}`
    )
      .then(async (response) => {
        if (response.ok) {
          setDataItems(await response.json());
        } else {
          console.log('error fetching data');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [rowsPerPage, currentPage, selectedNamespace, createdFilter, lastEvent]);

  const records: IDataTableRecord[] = dataItems.map((data: IData) => ({
    key: data.id,
    columns: [
      {
        value: <HashPopover textColor="secondary" address={data.id} />,
      },
      { value: data.validator },
      {
        value: <HashPopover textColor="secondary" address={data.hash} />,
      },
      { value: dayjs(data.created).format('MM/DD/YYYY h:mm A') },
    ],
    onClick: () => {
      setViewData(data);
    },
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
                {t('data')}
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
          </Grid>
          <Grid container item>
            <DataTable
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              {...{ columnHeaders }}
              {...{ records }}
              {...{ pagination }}
            />
          </Grid>
        </Grid>
      </Grid>
      {viewData && (
        <DataDetails
          open={!!viewData}
          onClose={() => {
            setViewData(undefined);
          }}
          data={viewData}
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
}));
