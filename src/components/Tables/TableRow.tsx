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
import { withStyles } from '@mui/styles';
import React from 'react';
import { IDataTableRecord } from './TableInterfaces';

interface Props {
  record: IDataTableRecord;
}

export const DataTableRow: React.FC<Props> = ({ record }) => {
  return (
    <>
      <StyledTableRow onClick={record.onClick}>
        {record.columns.map((column, index) => (
          <TableCell key={index}>{column.value}</TableCell>
        ))}
      </StyledTableRow>
    </>
  );
};

const StyledTableRow = withStyles((theme) => ({
  root: {
    tr: {
      border: 10,
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#21272D',
      border: 10,
      borderColor: 'red',
    },
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}))(TableRow);
