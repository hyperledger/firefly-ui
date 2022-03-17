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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PADDING } from '../../theme';

interface Props {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  onSetFilterAnchor: any;
}

export const FilterButton: React.FC<Props> = ({
  filters,
  setFilters,
  onSetFilterAnchor,
}) => {
  const { t } = useTranslation();

  const handleClear = () => {
    setFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((item) => item !== filter));
  };

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
      {filters.length > 0 && (
        <Grid
          container
          item
          xs={11}
          justifyContent="flex-end"
          my={DEFAULT_PADDING}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            spacing={1}
          >
            {filters.map((filter, index) => (
              <Grid key={`${filter}${index}`} item>
                <Chip
                  onDelete={() => handleRemoveFilter(filter)}
                  label={filter}
                />
              </Grid>
            ))}
            <Grid item>
              <Chip
                onClick={handleClear}
                variant="outlined"
                label={t('clear')}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid
        container
        item
        justifyContent="flex-end"
        my={DEFAULT_PADDING}
        xs={1}
        pl={1}
      >
        <Button
          sx={{ height: 40 }}
          variant="outlined"
          onClick={handleOpenFilter}
        >
          <Typography sx={{ fontSize: '14px' }}>{t('filter')}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};
