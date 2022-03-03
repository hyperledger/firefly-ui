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

import { Button, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardEmptyState } from '../../../components/Cards/CardEmptyState';
import { ChartHeader } from '../../../components/Charts/Header';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { TimelinePanel } from '../../../components/Timeline/Panel';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  EventKeyEnum,
  FF_Paths,
  ICreatedFilter,
  IMetricType,
} from '../../../interfaces';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import {
  fetchCatcher,
  isEventHistogramEmpty,
  makeEventHistogram,
} from '../../../utils';

export const ActivityDashboard: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Event types histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();

  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Events
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=${BucketCountEnum.Large}`
    )
      .then((histTypes: IMetricType[]) => {
        setEventHistData(makeEventHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  return (
    <>
      <Header title={t('timeline')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title={t('allActivity')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <Box
            mt={1}
            pb={2}
            borderRadius={1}
            sx={{
              width: '100%',
              height: 200,
              backgroundColor: 'background.paper',
            }}
          >
            {!eventHistData ? (
              <FFCircleLoader height={200} color="warning"></FFCircleLoader>
            ) : isEventHistogramEmpty(eventHistData) ? (
              <CardEmptyState
                height={200}
                text={t('noActivity')}
              ></CardEmptyState>
            ) : (
              <Histogram
                colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
                data={eventHistData}
                indexBy="timestamp"
                keys={[
                  EventKeyEnum.BLOCKCHAIN,
                  EventKeyEnum.MESSAGES,
                  EventKeyEnum.TOKENS,
                ]}
                includeLegend={true}
              ></Histogram>
            )}
          </Box>
          <TimelinePanel
            leftHeader={t('submittedByMe')}
            rightHeader={t('receivedFromEveryone')}
          ></TimelinePanel>
        </Grid>
      </Grid>
    </>
  );
};
