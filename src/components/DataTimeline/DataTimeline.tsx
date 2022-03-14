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

import React from 'react';
import { Paper, Grid, Typography, Divider } from '@mui/material';
import { Timeline } from '@mui/lab';
import { TimelineItemWrapper } from './TimelineItemWrapper';
import { ITimelineElement } from '../../interfaces';

interface Props {
  elements: ITimelineElement[];
  observerRef?: React.MutableRefObject<HTMLDivElement | null>;
  isFetching?: boolean;
  leftHeader?: string;
  rightHeader?: string;
}

export const DataTimeline: React.FC<Props> = ({
  elements,
  observerRef,
  isFetching,
  leftHeader,
  rightHeader,
}) => {
  return (
    <Paper
      sx={{
        width: '100%',
        height: 500,
        backgroundColor: 'background.paper',
      }}
      elevation={0}
    >
      <Grid
        container
        alignItems="flex-start"
        justifyContent="center"
        direction="column"
        padding={2}
      >
        <Grid container item>
          <Grid xs={6} container item justifyContent="center">
            <Typography fontSize="12" variant="caption" fontWeight="bold">
              {leftHeader}
            </Typography>
          </Grid>
          <Grid xs={6} container item justifyContent="center">
            <Typography fontSize="12" variant="caption" fontWeight="bold">
              {rightHeader}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Timeline
        sx={{
          paddingLeft: '5%',
          paddingRight: '5%',
          marginTop: 0,
          paddingTop: 0,
        }}
      >
        {elements.map((element) => (
          <TimelineItemWrapper
            key={element.key}
            {...{ element }}
            opposite={element.opposite}
          />
        ))}
        {/* USED FOR INFINITE SCROLL */}
        {/* {isFetching && (
          <Grid item>
            <CircularProgress sx={{ margin: 1, textAlign: 'center' }} />
          </Grid>
        )} */}
        <div ref={observerRef}></div>
      </Timeline>
    </Paper>
  );
};
