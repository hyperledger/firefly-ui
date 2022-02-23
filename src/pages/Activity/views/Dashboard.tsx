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

import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { ChartHeader } from '../../../components/Charts/Header';
import { TimelinePanel } from '../../../components/Timeline/Panel';
import { Header } from '../../../components/Header';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import { fetchWithCredentials } from '../../../utils';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { useTranslation } from 'react-i18next';
import { IEvent } from '../../../interfaces';

export const ActivityDashboard: () => JSX.Element = () => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const [events, setEvents] = useState<IEvent[]>([]);
  const { t } = useTranslation();

  const legend = [
    {
      color: FFColors.Yellow,
      title: 'Blockchain',
    },
    {
      color: FFColors.Orange,
      title: 'Tokens',
    },
    {
      color: FFColors.Pink,
      title: 'Messages',
    },
  ];

  useEffect(() => {
    fetchWithCredentials(`/api/v1/namespaces/${selectedNamespace}/events`).then(
      async (response) => {
        if (response.ok) {
          setEvents(await response.json());
        } else {
        }
      }
    );
  }, []);

  return (
    <>
      <Header title={t('timeline')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title="All Activity"
            legend={legend}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 10 }}>
                  Filter
                </Typography>
              </Button>
            }
          />
          {/* <Histogram data="undefined"></Histogram> */}
          <TimelinePanel
            leftHeader="Submitted by Me"
            rightHeader="Received from Everyone"
          ></TimelinePanel>
        </Grid>
      </Grid>
    </>
  );
};
