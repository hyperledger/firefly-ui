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

import { Button, Chip, Grid, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterContext } from '../../contexts/FilterContext';
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING } from '../../theme';

interface Props {
  onSetFilterAnchor: any;
}

export const FilterButton: React.FC<Props> = ({ onSetFilterAnchor }) => {
  const { t } = useTranslation();
  const { clearAllFilters, filterArray, removeFilter } =
    useContext(FilterContext);

  const handleOpenFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    onSetFilterAnchor(event);
  };

  return (
    <Grid
      direction="row"
      justifyContent="flex-end"
      container
      item
      alignItems="center"
    >
      {filterArray.length > 0 && (
        <Grid
          container
          item
          xs={11}
          justifyContent="flex-end"
          my={DEFAULT_PADDING}
        >
          <Grid container alignItems="center" justifyContent="flex-end">
            {filterArray.map((filter, index) => (
              <Grid key={`${filter}${index}`} item pl={1}>
                <Chip onDelete={() => removeFilter(filter)} label={filter} />
              </Grid>
            ))}
            <Grid item pl={1}>
              <Chip
                onClick={clearAllFilters}
                variant="outlined"
                label={t('clear')}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid container item justifyContent="flex-end" my={1} xs={1} pl={1}>
        <Button
          sx={{ height: 40, borderRadius: DEFAULT_BORDER_RADIUS }}
          variant="outlined"
          onClick={handleOpenFilter}
        >
          <Typography sx={{ fontSize: '12px' }}>{t('filter')}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};
