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

import { Grid, Paper } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Histogram } from '../../../components/Charts/Histogram';
import { EventCardWrapper } from '../../../components/DataTimeline/Cards/Events/EventCardWrapper';
import { DataTimeline } from '../../../components/DataTimeline/DataTimeline';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  ICreatedFilter,
  IEvent,
  ITimelineElement,
  FF_EVENTS,
  EventCategoryEnum,
} from '../../../interfaces';
import { DEFAULT_HIST_HEIGHT, DEFAULT_PADDING, FFColors } from '../../../theme';
import { fetchCatcher, makeEventHistogram } from '../../../utils';
import { isHistogramEmpty } from '../../../utils/charts';

export const ActivityTimeline: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [eventHistData, setEventHistData] = useState<BarDatum[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const { t } = useTranslation();

  // Events Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    Promise.all([
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
          BucketCollectionEnum.Events,
          createdFilterObject.filterTime,
          currentTime,
          BucketCountEnum.Large
        )}`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}?fetchreferences`
      ),
    ])
      .then(([histEvents, events]) => {
        setEventHistData(makeEventHistogram(histEvents));
        setEvents(events);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const determineOpposite = (eventType: string) => {
    switch (eventType) {
      case FF_EVENTS.TX_SUBMITTED:
        return true;
      default:
        return false;
    }
  };

  const timelineElements: ITimelineElement[] = events.map((event) => ({
    key: event.id,
    item: <EventCardWrapper {...{ event }} />,
    opposite: determineOpposite(event.type),
  }));

  return (
    <>
      <Header title={t('timeline')} subtitle={t('activity')} />
      <Grid container px={DEFAULT_PADDING} direction="column" spacing={2}>
        <Grid item>
          <Paper
            sx={{
              width: '100%',
              height: 200,
              backgroundColor: 'background.paper',
            }}
            elevation={0}
          >
            <Histogram
              colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
              data={eventHistData}
              indexBy="timestamp"
              keys={[
                EventCategoryEnum.BLOCKCHAIN,
                EventCategoryEnum.MESSAGES,
                EventCategoryEnum.TOKENS,
              ]}
              includeLegend={true}
              isEmpty={isHistogramEmpty(eventHistData ?? [])}
              emptyText={t('noActivity')}
              height={DEFAULT_HIST_HEIGHT}
            />
          </Paper>
        </Grid>
        <Grid item>
          <DataTimeline
            leftHeader={t('submittedByMe')}
            rightHeader={t('receivedFromEveryone')}
            elements={timelineElements}
          />
        </Grid>
      </Grid>
    </>
  );
};
