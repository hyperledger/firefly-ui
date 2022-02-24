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

import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ChartHeader } from '../../../components/Charts/Header';
import { Histogram } from '../../../components/Charts/Histogram';
import { TimelinePanel } from '../../../components/Timeline/Panel';
import { Header } from '../../../components/Header';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import { getCreatedFilter } from '../../../components/Filters/utils';
import {
  ICreatedFilter,
  FF_Paths,
  IMetricType,
  EventKeyEnum,
} from '../../../interfaces';
import {
  fetchCatcher,
  isHistogramEmpty,
  makeHistogramEventBuckets,
} from '../../../utils';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { CardEmptyState } from '../../../components/Cards/CardEmptyState';
import { useTranslation } from 'react-i18next';

export const ActivityEvents: () => JSX.Element = () => {
  const { createdFilter, lastEvent, orgName, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Event types histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        'events'
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=24`
    )
      .then((histTypes: IMetricType[]) => {
        setEventHistData(makeHistogramEventBuckets(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  return (
    <>
      <Header title={'Events'} subtitle={'Activity'}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title="All Events"
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  Filter
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
            ) : isHistogramEmpty(eventHistData) ? (
              <CardEmptyState
                height={200}
                text={t('noEvents')}
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
            leftHeader="Submitted by Me"
            rightHeader="Received from Everyone"
          ></TimelinePanel>
        </Grid>
      </Grid>
    </>
  );
};
