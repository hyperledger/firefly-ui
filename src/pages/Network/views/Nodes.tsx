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

import HexagonIcon from '@mui/icons-material/Hexagon';
import { Button, Chip, Grid, TablePagination, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataTable } from '../../../components/Tables/Table';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { FF_Paths, INode, IPagedNodeResponse } from '../../../interfaces';
import { DEFAULT_PADDING } from '../../../theme';
import { fetchCatcher } from '../../../utils';

const PAGE_LIMITS = [10, 25];

export const NetworkNodes: () => JSX.Element = () => {
  const { nodeName } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  // Nodes
  const [nodes, setNodes] = useState<INode[]>();
  // Node total
  const [nodeTotal, setNodeTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (newPage > currentPage && rowsPerPage * (currentPage + 1) >= nodeTotal) {
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

  // Nodes
  useEffect(() => {
    fetchCatcher(
      `${FF_Paths.apiPrefix}/${
        FF_Paths.networkNodes
      }?limit=${rowsPerPage}&count&skip=${
        rowsPerPage * currentPage
      }&sort=created`
    )
      .then((nodeRes: IPagedNodeResponse) => {
        setNodes(nodeRes.items);
        setNodeTotal(nodeRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage]);

  const nodeColHeaders = [
    t('name'),
    t('nodeID'),
    t('orgOwner'),
    t('messageID'),
    t('created'),
    t(''),
  ];

  const nodeRecords: IDataTableRecord[] | undefined = nodes?.map((node) => {
    return {
      key: node.id,
      columns: [
        {
          value: (
            <>
              <Grid container justifyContent="flex-start" alignItems="center">
                <HexagonIcon sx={{ color: '#FFFFFF' }} />
                <Typography pl={DEFAULT_PADDING} variant="body1">
                  {node.name}
                </Typography>
              </Grid>
            </>
          ),
        },
        {
          value: <HashPopover shortHash={true} address={node.id} />,
        },
        {
          value: <HashPopover address={node.did} />,
        },
        {
          value: <HashPopover shortHash={true} address={node.messages.claim} />,
        },
        { value: dayjs(node.created).format('MM/DD/YYYY h:mm A') },
        {
          value:
            nodeName === node.name ? (
              <Chip color="success" label={t('yourNode')}></Chip>
            ) : (
              ''
            ),
        },
      ],
    };
  });

  return (
    <>
      <Header title={t('nodes')} subtitle={t('network')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allNodes')}
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
            records={nodeRecords}
            columnHeaders={nodeColHeaders}
            {...{ pagination }}
            emptyStateText={t('noNodesToDisplay')}
          />
        </Grid>
      </Grid>
    </>
  );
};
