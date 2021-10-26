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
import { useNetworkMapTranslation } from '../registration';
import { fetchCatcher } from '../../../core/utils';
import { useQuery } from 'react-query';
import {
  IDataTableRecord,
  INode,
  IOrganization,
} from '../../../core/interfaces';
import { StatusChip } from '../../../core/components/StatusChip';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DataTable } from '../../../core/components/DataTable/DataTable';
import GoogleCirclesExtendedIcon from 'mdi-react/GoogleCirclesExtendedIcon';

const PAGE_LIMITS = [10, 25];

export const Nodes: () => JSX.Element = () => {
  const { t } = useNetworkMapTranslation();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const getOrgsApi = '/api/v1/network/organizations';
  const getOrgsFn = () => fetchCatcher(getOrgsApi);
  const { data: orgs, isLoading: orgsLoading } = useQuery<IOrganization[]>(
    getOrgsApi,
    getOrgsFn
  );

  const getNodesApi = '/api/v1/network/nodes';
  const getNodesFn = () => fetchCatcher(getNodesApi);
  const { data: nodes, isLoading: nodesLoading } = useQuery<INode[]>(
    getNodesApi,
    getNodesFn
  );

  const columnHeaders = [
    t('nodeName'),
    t('size'),
    t('nodeId'),
    t('organization'),
    t('created'),
    t('status'),
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

  nodes?.forEach((n) =>
    records.push({
      key: n.id,
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
                <GoogleCirclesExtendedIcon />
              </Grid>
              <Grid item>{n.name}</Grid>
            </Grid>
          ),
        },
        { value: t('small') },
        {
          value: n.id,
        },
        {
          value: orgs?.find((o) => n.owner === o.identity)?.name || '',
        },
        { value: dayjs(n.created).format('MM/DD/YYYY h:mm A') },
        { value: <StatusChip status={t('live')} /> },
      ],
    })
  );

  const content =
    orgsLoading || nodesLoading ? (
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
          {t('nodes')}
        </Typography>
      </Grid>
      <Grid item>{content}</Grid>
    </Grid>
  );
};
