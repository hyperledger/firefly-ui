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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DateFilterContext } from '../../contexts/DateFilterContext';
import { TimeFilterEnum } from '../../interfaces';
import {
  END_TIME_QUERY_KEY,
  START_TIME_QUERY_KEY,
  TIME_QUERY_KEY,
} from '../AppWrapper';

const formatInputValue = (value?: string | null) => {
  if (!value) {
    return '';
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm') : '';
};

export const DatePicker: React.FC = () => {
  const { t } = useTranslation();
  const { setTimeSearchParam, searchParams } = useContext(DateFilterContext);

  const getCurrentTimeFilter = (): TimeFilterEnum => {
    const currentParam = searchParams.get(TIME_QUERY_KEY);
    if (currentParam && currentParam in TimeFilterEnum) {
      return currentParam as TimeFilterEnum;
    }
    return TimeFilterEnum['24hours'];
  };

  const [selectedValue, setSelectedValue] = useState<TimeFilterEnum | ''>(
    getCurrentTimeFilter()
  );
  const [lastAppliedValue, setLastAppliedValue] = useState<TimeFilterEnum | ''>(
    getCurrentTimeFilter()
  );
  const [customStart, setCustomStart] = useState(
    formatInputValue(searchParams.get(START_TIME_QUERY_KEY))
  );
  const [customEnd, setCustomEnd] = useState(
    formatInputValue(searchParams.get(END_TIME_QUERY_KEY))
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const currentFilter = getCurrentTimeFilter();
    setSelectedValue(currentFilter);
    setLastAppliedValue(currentFilter);
    setCustomStart(formatInputValue(searchParams.get(START_TIME_QUERY_KEY)));
    setCustomEnd(formatInputValue(searchParams.get(END_TIME_QUERY_KEY)));
  }, [searchParams]);

  const createdQueryOptions = useMemo(
    () => [
      {
        value: TimeFilterEnum['1hour'],
        label: t('last1Hour'),
      },
      {
        value: TimeFilterEnum['24hours'],
        label: t('last24Hours'),
      },
      {
        value: TimeFilterEnum['7days'],
        label: t('last7Days'),
      },
      {
        value: TimeFilterEnum['30days'],
        label: t('last30Days'),
      },
      {
        value: TimeFilterEnum.custom,
        label: t('customRange'),
      },
    ],
    [t]
  );

  const startMoment = customStart ? dayjs(customStart) : null;
  const endMoment = customEnd ? dayjs(customEnd) : null;
  const hasStart = !!customStart;
  const hasEnd = !!customEnd;
  const rangeError =
    startMoment !== null &&
    endMoment !== null &&
    startMoment.isValid() &&
    endMoment.isValid() &&
    startMoment.isAfter(endMoment);
  const missingRange = !hasStart && !hasEnd;
  const applyDisabled =
    rangeError ||
    (startMoment !== null && !startMoment.isValid()) ||
    (endMoment !== null && !endMoment.isValid()) ||
    missingRange;

  const openCustomDialog = () => {
    setSelectedValue(TimeFilterEnum.custom);
    if (!customStart && !customEnd) {
      const now = dayjs();
      setCustomEnd(now.format('YYYY-MM-DDTHH:mm'));
      setCustomStart(now.subtract(24, 'hours').format('YYYY-MM-DDTHH:mm'));
    }
    setIsDialogOpen(true);
  };

  const handleSelectChange = (value: string) => {
    if (value === TimeFilterEnum.custom) {
      openCustomDialog();
      return;
    }
    setSelectedValue(value as TimeFilterEnum);
    setTimeSearchParam(value as TimeFilterEnum);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedValue(lastAppliedValue);
    setCustomStart(formatInputValue(searchParams.get(START_TIME_QUERY_KEY)));
    setCustomEnd(formatInputValue(searchParams.get(END_TIME_QUERY_KEY)));
  };

  const handleApplyCustom = () => {
    if (applyDisabled) {
      return;
    }
    const startISO =
      startMoment && startMoment.isValid() ? startMoment.toISOString() : null;
    const endISO =
      endMoment && endMoment.isValid() ? endMoment.toISOString() : null;
    setTimeSearchParam(TimeFilterEnum.custom, startISO, endISO);
    setIsDialogOpen(false);
  };

  return (
    <>
      <TextField
        select
        size="small"
        variant="outlined"
        value={selectedValue ?? ''}
        onChange={(event) => {
          handleSelectChange(event.target.value);
        }}
        sx={{ pr: 2 }}
      >
        {createdQueryOptions.map((item) => (
          <MenuItem
            sx={{ fontSize: '16px' }}
            key={item.value}
            value={item.value}
            onClick={
              item.value === TimeFilterEnum.custom
                ? () => openCustomDialog()
                : undefined
            }
          >
            {item.label}
          </MenuItem>
        ))}
      </TextField>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{t('customTimeRange')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField
              label={t('startTime')}
              type="datetime-local"
              value={customStart}
              onChange={(event) => setCustomStart(event.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={rangeError}
            />
            <TextField
              label={t('endTime')}
              type="datetime-local"
              value={customEnd}
              onChange={(event) => setCustomEnd(event.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={rangeError}
              helperText={rangeError ? t('endTimeBeforeStart') : undefined}
            />
            {missingRange && (
              <Typography color="error" variant="caption">
                {t('enterStartOrEndTime')}
              </Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleApplyCustom}
            disabled={applyDisabled}
          >
            {t('apply')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
