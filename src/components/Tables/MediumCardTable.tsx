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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { IDataTableRecord } from '../../interfaces/table';
import { EmptyStateCard } from '../Cards/EmptyStateCard';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { MediumCardTableRow } from './MediumCardTableRow';

interface Props {
  records?: IDataTableRecord[];
  columnHeaders?: string[];
  emptyMessage: string;
}

export const MediumCardTable: React.FC<Props> = ({
  records,
  columnHeaders,
  emptyMessage,
}) => {
  return (
    <>
      {!records ? (
        <FFCircleLoader color="warning"></FFCircleLoader>
      ) : records.length ? (
        <TableContainer sx={{ whiteSpace: 'nowrap' }}>
          <Table stickyHeader={true}>
            <TableHead>
              <TableRow>
                {columnHeaders?.map((header, index) => (
                  <TableCell
                    sx={{
                      paddingTop: 0,
                      borderBottom: 0,
                      backgroundColor: 'background.paper',
                    }}
                    key={index}
                  >
                    <Typography
                      color="secondary"
                      sx={{
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
                <MediumCardTableRow key={record.key} {...{ record }} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyStateCard text={emptyMessage} />
      )}
    </>
  );
};
