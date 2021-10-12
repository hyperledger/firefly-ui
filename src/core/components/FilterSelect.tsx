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
import { TextField, MenuItem } from '@mui/material';
import { FilterOptions, IFilterItem } from '../interfaces';
import { theme } from '../App';

interface Props {
  filter: FilterOptions;
  setFilter: React.Dispatch<React.SetStateAction<FilterOptions>>;
  filterItems: IFilterItem[];
}

export const FilterSelect: React.FC<Props> = ({
  filter,
  setFilter,
  filterItems,
}) => {
  return (
    <>
      <TextField
        select
        size="small"
        variant="outlined"
        value={filter}
        onChange={(event) => setFilter(event.target.value as FilterOptions)}
      >
        {filterItems.map((item) => (
          <MenuItem
            sx={{
              color:
                filter === item.value
                  ? theme.palette.text.primary
                  : theme.palette.text.disabled,
            }}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};
