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

import LaunchIcon from '@mui/icons-material/Launch';
import {
  Button,
  Grid,
  IconButton,
  Link,
  TablePagination,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataTable } from '../../../components/Tables/Table';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  ICreatedFilter,
  IFireflyApi,
  IPagedFireFlyApiResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING } from '../../../theme';
import { fetchCatcher } from '../../../utils';

const PAGE_LIMITS = [10, 25];

export const BlockchainApis: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // APIs
  const [apis, setApis] = useState<IFireflyApi[]>();
  // API Totals
  const [apiTotal, setApiTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (newPage > currentPage && rowsPerPage * (currentPage + 1) >= apiTotal) {
      return;
    }
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
      sx={{ color: 'text.secondary' }}
    />
  );

  // Listeners
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.apis
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((apis: IPagedFireFlyApiResponse) => {
        setApis(apis.items);
        setApiTotal(apis.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, lastEvent, selectedNamespace]);

  const apiColHeaders = [
    t('name'),
    t('id'),
    t('interfaceID'),
    t('location'),
    t('openApi'),
    t('swagger'),
  ];

  const apiRecords: IDataTableRecord[] | undefined = apis?.map((api) => ({
    key: api.id,
    columns: [
      {
        value: <Typography>{api.name}</Typography>,
      },
      {
        value: <HashPopover shortHash={true} address={api.id}></HashPopover>,
      },
      {
        value: (
          <HashPopover
            shortHash={true}
            address={api.interface.id}
          ></HashPopover>
        ),
      },
      {
        value: (
          <HashPopover
            shortHash={true}
            address={api.location.address}
          ></HashPopover>
        ),
      },
      {
        value: (
          <Link target="_blank" href={api.urls.openapi} underline="always">
            <IconButton>
              <LaunchIcon />
            </IconButton>
          </Link>
        ),
      },
      {
        value: (
          <Link target="_blank" href={api.urls.ui} underline="always">
            <IconButton>
              <LaunchIcon />
            </IconButton>
          </Link>
        ),
      },
    ],
  }));

  return (
    <>
      <Header title={t('apis')} subtitle={t('blockchain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allApis')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <DataTable
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={apiRecords}
            columnHeaders={apiColHeaders}
            {...{ pagination }}
            emptyStateText={t('noApisToDisplay')}
          />
        </Grid>
      </Grid>
    </>
  );
};
