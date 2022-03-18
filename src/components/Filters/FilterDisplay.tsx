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

import { Chip, Grid } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FilterDisplay: React.FC<Props> = ({ filters, setFilters }) => {
  const { t } = useTranslation();

  const handleClear = () => {
    setFilters([]);
  };

  const handleRemoveFilter = (filter: string) => {
    setFilters(filters.filter((item) => item !== filter));
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="flex-end" spacing={1}>
        {filters.map((filter, index) => (
          <Grid key={`${filter}${index}`} item>
            <Chip onDelete={() => handleRemoveFilter(filter)} label={filter} />
          </Grid>
        ))}
        <Grid item>
          <Chip onClick={handleClear} variant="outlined" label={t('clear')} />
        </Grid>
      </Grid>
    </>
  );
};
