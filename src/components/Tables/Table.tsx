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

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { DataTableRow } from './TableRow';
import { themeOptions } from '../../theme';
import { IDataTableRecord } from './TableInterfaces';

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
  return (
    <>
      {header && (
        <Grid>
          <Typography sx={{ fontWeight: 'bold' }}>{header}</Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <TableContainer
          style={{ maxHeight, minHeight }}
          sx={{ paddingTop: 2, whiteSpace: 'nowrap' }}
        >
          <Table stickyHeader={stickyHeader}>
            <TableHead>
              <TableRow>
                {columnHeaders?.map((header, index) => (
                  <TableCell
                    sx={{
                      borderBottom: 0,
                    }}
                    key={index}
                  >
                    <Typography
                      sx={{
                        color: themeOptions.palette?.text?.secondary,
                        fontSize: 12,
                        textTransform: 'uppercase',
                      }}
                      noWrap
                    >
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
