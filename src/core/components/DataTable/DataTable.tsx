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

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { IDataTableRecord } from '../../interfaces';
import { DataTableRow } from './DataTableRow';

interface Props {
  records?: IDataTableRecord[];
  columnHeaders?: string[];
  stickyHeader?: boolean;
  pagination?: JSX.Element;
  header?: string;
  minHeight?: string;
  maxHeight?: string;
}

export const DataTable: React.FC<Props> = ({
  records,
  columnHeaders,
  stickyHeader,
  pagination,
  header,
  minHeight,
  maxHeight,
}) => {
  const classes = useStyles();

  return (
    <>
      {header && (
        <Grid>
          <Typography className={classes.header}>{header}</Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <TableContainer
          style={{ maxHeight, minHeight }}
          className={classes.tableContainer}
        >
          <Table stickyHeader={stickyHeader}>
            <TableHead>
              <TableRow>
                {columnHeaders?.map((header, index) => (
                  <TableCell className={classes.cell} key={index}>
                    <Typography className={classes.tableHeader} noWrap>
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records?.map((record) => (
                <DataTableRow key={record.key} {...{ record }} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination}
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    whiteSpace: 'nowrap',
  },
  cell: {
    borderBottom: 0,
    color: theme.palette.text.secondary,
  },
  header: {
    fontWeight: 'bold',
  },
  tableHeader: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
}));
