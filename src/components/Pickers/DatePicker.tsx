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

import { MenuItem, TextField } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateFilterContext } from '../../contexts/DateFilterContext';
import { CreatedFilterOptions } from '../../interfaces';
import { TIME_QUERY_KEY } from '../AppWrapper';

export const DatePicker: React.FC = () => {
  const { t } = useTranslation();
  const { addDateToParams, searchParams } = useContext(DateFilterContext);

  const createdQueryOptions = useMemo(
    () => [
      {
        value: '1hour',
        label: t('last1Hour'),
      },
      {
        value: '24hours',
        label: t('last24Hours'),
      },
      {
        value: '7days',
        label: t('last7Days'),
      },
      {
        value: '30days',
        label: t('last30Days'),
      },
    ],
    [t]
  );

  return (
    <>
      <TextField
        select
        size="small"
        variant="outlined"
        value={searchParams.get(TIME_QUERY_KEY) ?? ''}
        onChange={(event) => {
          addDateToParams(event.target.value as CreatedFilterOptions);
        }}
        sx={{ pr: 2 }}
      >
        {createdQueryOptions.map((item) => (
          <MenuItem
            sx={{ fontSize: '16px' }}
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
