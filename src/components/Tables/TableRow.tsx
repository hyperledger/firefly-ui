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
import { FFBackgroundHover, themeOptions } from '../../theme';
import { IDataTableRecord } from './TableInterfaces';

interface Props {
  leftBorderColor?: string;
  record: IDataTableRecord;
}

export const DataTableRow: React.FC<Props> = ({ record, leftBorderColor }) => {
  const borderRadius = '8px';

  return (
    <TableRow
      sx={{
        backgroundColor: themeOptions.palette?.background?.paper,
        '&:hover': {
          backgroundColor: record.onClick ? FFBackgroundHover : undefined,
          cursor: record.onClick ? 'pointer' : 'default',
        },
      }}
      onClick={record.onClick}
    >
      {record.columns.map((column, index) => {
        return (
          <TableCell
            key={index}
            sx={{
              borderLeft:
                index == 0 ? `8px solid ${leftBorderColor}` : undefined,
              borderTopLeftRadius: index == 0 ? borderRadius : undefined,
              borderBottomLeftRadius: index == 0 ? borderRadius : undefined,
              borderTopRightRadius:
                index == record.columns.length - 1 ? borderRadius : undefined,
              borderBottomRightRadius:
                index == record.columns.length - 1 ? borderRadius : undefined,
              margin: '16px 16px 16px 16px',
              padding: '8px',
            }}
          >
            {column.value}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
