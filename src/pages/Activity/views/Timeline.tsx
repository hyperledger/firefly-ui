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
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { TimelinePanel } from '../../../components/Timeline/Panel';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_EVENTS_CATEGORY_MAP,
  FF_Paths,
  ICreatedFilter,
  IMetric,
} from '../../../interfaces';
import { DEFAULT_HIST_HEIGHT, DEFAULT_PADDING } from '../../../theme';
import { fetchCatcher, makeEventHistogram } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

export const ActivityTimeline: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();

  // Events Histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Events,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Large
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setEventHistData(makeEventHistogram(histTypes));
      })
      .catch((err) => {
        setEventHistData([]);
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  return (
    <>
      <Header title={t('timeline')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allActivity')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <Histogram
            height={DEFAULT_HIST_HEIGHT}
            colors={makeColorArray(FF_EVENTS_CATEGORY_MAP)}
            data={eventHistData}
            indexBy="timestamp"
            keys={makeKeyArray(FF_EVENTS_CATEGORY_MAP)}
            includeLegend={true}
            isEmpty={isHistogramEmpty(eventHistData ?? [])}
            emptyText={t('noActivity')}
          />
          <TimelinePanel
            leftHeader={t('submittedByMe')}
            rightHeader={t('receivedFromEveryone')}
          ></TimelinePanel>
        </Grid>
      </Grid>
    </>
  );
};
