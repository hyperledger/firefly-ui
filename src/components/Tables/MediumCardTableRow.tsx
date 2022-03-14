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

import { TableCell, TableRow, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import { FFBackgroundHover } from '../../theme';
import { IDataTableRecord } from './TableInterfaces';

interface Props {
  record: IDataTableRecord;
}

export const MediumCardTableRow: React.FC<Props> = ({ record }) => {
  return (
    <>
      <StyledTableRow onClick={record.onClick}>
        {record.columns.map((column, index) => (
          <TableCell key={index}>
            <Typography>{column.value}</Typography>
          </TableCell>
        ))}
      </StyledTableRow>
    </>
  );
};

const StyledTableRow = withStyles((theme) => ({
  root: {
    borderLeft: 10,
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: FFBackgroundHover,
    },
  },
}))(TableRow);
