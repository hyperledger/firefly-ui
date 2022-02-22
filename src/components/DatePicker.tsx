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

import React, { useContext, useMemo, useEffect } from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQueryParam, StringParam } from 'use-query-params';
import { CreatedFilterOptions } from '../_core/interfaces';
import { ApplicationContext } from '../contexts/ApplicationContext';

export const DatePicker: React.FC = () => {
  const { t } = useTranslation();
  const { createdFilter, setCreatedFilter } = useContext(ApplicationContext);
  const [time, setTime] = useQueryParam('time', StringParam);

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

  useEffect(() => {
    // set time if it's present in the url
    if (time && createdQueryOptions.find((option) => option.value === time)) {
      setCreatedFilter(time as CreatedFilterOptions);
      return;
    }

    // use time from state and update the url
    setTime(createdFilter, 'replaceIn');
  }, [time, setTime, setCreatedFilter, createdQueryOptions, createdFilter]);

  return (
    <>
      <TextField
        select
        size="small"
        variant="outlined"
        value={createdFilter}
        onChange={(event) => {
          setTime(event.target.value as CreatedFilterOptions);
          setCreatedFilter(event.target.value as CreatedFilterOptions);
        }}
        sx={{ pr: 2 }}
      >
        {createdQueryOptions.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};
