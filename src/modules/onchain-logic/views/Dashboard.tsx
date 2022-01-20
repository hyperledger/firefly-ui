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
  TablePagination,
  Typography,
} from '@mui/material';
import React, { useState, useContext } from 'react';
import { IDataTableRecord, IContractInterface } from '../../../core/interfaces';
import { useQuery } from 'react-query';
import { fetchCatcher } from '../../../core/utils';
import { useOnChainLogicTranslation } from '../registration';
import { DataTable } from '../../../core/components/DataTable/DataTable';
import { NamespaceContext } from '../../../core/contexts/NamespaceContext';
import FileCodeOutlineIcon from 'mdi-react/FileCodeOutlineIcon';

const PAGE_LIMITS = [10, 25];

export const Dashboard: () => JSX.Element = () => {
  const { t } = useOnChainLogicTranslation();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);
  const { selectedNamespace } = useContext(NamespaceContext);

  const getContractsInterfacesApi = `/api/v1/namespaces/${selectedNamespace}/contracts/interfaces?limit=${rowsPerPage}&skip=${
    rowsPerPage * currentPage
  }`;
  const getContractsInterfaces = () => fetchCatcher(getContractsInterfacesApi);
  const { data: contractInterfaces, isLoading: contractInterfacesLoading } =
    useQuery<IContractInterface[]>(
      getContractsInterfacesApi,
      getContractsInterfaces
    );

  const columnHeaders = [
    t('contract'),
    t('id'),
    t('message'),
    t('description'),
    t('version'),
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
      sx={{ color: (theme) => theme.palette.text.secondary }}
    />
  );

  const records: IDataTableRecord[] = [];

  contractInterfaces?.forEach((o) => {
    records.push({
      key: o.id,
      columns: [
        {
          value: (
            <Grid
              item
              container
              direction="row"
              alignItems="center"
              spacing={3}
            >
              <Grid item mt={1}>
                <FileCodeOutlineIcon />
              </Grid>
              <Grid item>{o.name}</Grid>
            </Grid>
          ),
        },
        {
          value: o.id,
        },
        {
          value: o.message,
        },
        {
          value: o.description,
        },
        { value: o.version },
      ],
    });
  });

  const content = contractInterfacesLoading ? (
    <CircularProgress />
  ) : (
    <DataTable
      minHeight="300px"
      maxHeight="calc(100vh - 340px)"
      {...{ columnHeaders }}
      {...{ records }}
      {...{ pagination }}
    />
  );

  return (
    <Grid container item wrap="nowrap" direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h4" fontWeight="bold">
          {t('onChainLogic')}
        </Typography>
      </Grid>
      <Grid item>{content}</Grid>
    </Grid>
  );
};
