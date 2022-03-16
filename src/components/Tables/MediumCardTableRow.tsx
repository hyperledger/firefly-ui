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

import { TableCell, TableRow } from '@mui/material';
import React from 'react';
import { IDataTableRecord } from '../../interfaces/table';
import { FFBackgroundHover, themeOptions } from '../../theme';

interface Props {
  record: IDataTableRecord;
}

export const MediumCardTableRow: React.FC<Props> = ({ record }) => {
  return (
    <TableRow
      sx={{
        backgroundColor: themeOptions.palette?.background?.paper,
        '&:hover': {
          backgroundColor: record.onClick ? FFBackgroundHover : undefined,
          cursor: record.onClick ? 'pointer' : 'default',
        },
        margin: '16px 16px 16px 16px',
        padding: '8px',
        borderBottom: '1px solid ' + themeOptions.palette?.background?.default,
      }}
      onClick={record.onClick}
    >
      {record.columns.map((column, index) => {
        return (
          <TableCell
            key={index}
            sx={{
              margin: '16px 16px 16px 16px',
              padding: '8px',
              borderBottom:
                '1px solid ' + themeOptions.palette?.background?.default,
            }}
          >
            {column.value}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
