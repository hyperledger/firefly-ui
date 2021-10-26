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
  Avatar,
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
  IStatus,
} from '../../../core/interfaces';
import { HashPopover } from '../../../core/components/HashPopover';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DataTable } from '../../../core/components/DataTable/DataTable';

const PAGE_LIMITS = [10, 25];

export const Organizations: () => JSX.Element = () => {
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

  const getStatusApi = '/api/v1/status';
  const getStatusFn = () => fetchCatcher(getStatusApi);
  const { data: status, isLoading: statusLoading } = useQuery<IStatus>(
    getStatusApi,
    getStatusFn
  );

  const orgMap: Map<IOrganization, INode[] | undefined> = new Map();
  orgs?.forEach((o) =>
    orgMap.set(
      o,
      nodes?.filter((n) => n.owner === o.identity)
    )
  );

  const columnHeaders = [
    t('organization'),
    t('fireflyNodes'),
    t('orgId'),
    t('identity'),
    t('joined'),
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

  orgMap.forEach((n, o) => {
    const isMyOrg = status?.org.identity === o.identity;
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
              <Grid item>
                <Avatar
                  sx={{
                    textTransform: 'uppercase',
                    backgroundColor: (theme) =>
                      isMyOrg
                        ? theme.palette.info.dark
                        : theme.palette.secondary.main,
                    color: (theme) => theme.palette.text.primary,
                  }}
                  alt={o.name}
                >
                  {o.name.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item>{o.name}</Grid>
            </Grid>
          ),
        },
        { value: n?.length || 0 },
        {
          value: o.id,
        },
        {
          value: <HashPopover textColor="secondary" address={o.identity} />,
        },
        { value: dayjs(o.created).format('MM/DD/YYYY h:mm A') },
      ],
    });
  });

  const content =
    orgsLoading || nodesLoading || statusLoading ? (
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
          {t('organizations')}
        </Typography>
      </Grid>
      <Grid item>{content}</Grid>
    </Grid>
  );
};
