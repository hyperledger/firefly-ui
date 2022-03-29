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
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { DEFAULT_PADDING } from '../../theme';

interface Props {
  message?: string;
  columnHeaders: string[];
  stickyHeader?: boolean;
  dashboardSize: boolean;
}

export const DataTableEmptyState: React.FC<Props> = ({
  message,
  columnHeaders,
  stickyHeader,
  dashboardSize,
}) => {
  return (
    <>
      <Grid item xs={12} container mt={2}>
        <TableContainer sx={{ whiteSpace: 'nowrap' }}>
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
                        color: 'text.secondary',
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
          </Table>
        </TableContainer>
        <Paper sx={{ height: '100%', width: '100%' }}>
          <Grid
            container
            item
            justifyContent="center"
            alignItems="center"
            direction="row"
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              py={DEFAULT_PADDING}
              sx={{
                height: dashboardSize ? '150px' : '500px',
                minHeight: 150,
              }}
            >
              <Typography sx={{ fontSize: '16px' }} variant="body1">
                {message}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};
