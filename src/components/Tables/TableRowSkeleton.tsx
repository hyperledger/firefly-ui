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

import { Skeleton, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';

interface Props {
  numColumns: number;
}

export const TableRowSkeleton: React.FC<Props> = ({ numColumns }) => {
  return (
    <TableRow
      sx={{
        backgroundColor: themeOptions.palette?.background?.paper,
      }}
    >
      {Array.from(Array(numColumns)).map((column, index) => {
        return (
          <TableCell
            key={index}
            sx={{
              height: '49px',
              borderTopLeftRadius:
                index == 0 ? DEFAULT_BORDER_RADIUS : undefined,
              borderBottomLeftRadius:
                index == 0 ? DEFAULT_BORDER_RADIUS : undefined,
              borderTopRightRadius:
                index == numColumns - 1 ? DEFAULT_BORDER_RADIUS : undefined,
              borderBottomRightRadius:
                index == numColumns - 1 ? DEFAULT_BORDER_RADIUS : undefined,
              margin: '16px 16px 16px 16px',
              padding: '8px',
              borderBottom:
                '1px solid ' + themeOptions.palette?.background?.default,
            }}
          >
            <Skeleton width="70%" />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
