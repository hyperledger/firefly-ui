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

import { Timeline } from '@mui/lab';
import { Grid, Paper } from '@mui/material';
import React from 'react';
import { ITimelineElement } from '../../interfaces';
import { DEFAULT_TIMELINE_HEIGHT } from '../../theme';
import { EmptyStateCard } from '../Cards/EmptyStateCard';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { TimelineItemWrapper } from './TimelineItemWrapper';

interface Props {
  elements: ITimelineElement[] | undefined;
  observerRef?: React.MutableRefObject<HTMLDivElement | null>;
  isFetching?: boolean;
  emptyText: string;
  height?: string | number;
}

export const FFTimeline: React.FC<Props> = ({
  elements,
  observerRef,
  isFetching,
  emptyText,
  height,
}) => {
  return (
    <Paper
      sx={{
        width: '100%',
        height: height ?? DEFAULT_TIMELINE_HEIGHT,
        backgroundColor: 'background.paper',
        overflow: 'auto',
      }}
      elevation={0}
    >
      {!elements ? (
        <FFCircleLoader height="100%" color="warning"></FFCircleLoader>
      ) : elements.length === 0 ? (
        <EmptyStateCard text={emptyText}></EmptyStateCard>
      ) : (
        <>
          <Timeline
            sx={{
              paddingLeft: '15%',
              paddingRight: '15%',
              marginTop: 0,
              paddingTop: 0,
            }}
          >
            {elements.map((element, idx) => (
              <TimelineItemWrapper
                key={element.key}
                {...{ element }}
                opposite={element.opposite}
              />
            ))}
            {/* TODO: USED FOR INFINITE SCROLL */}
            {isFetching && (
              <Grid item>
                <FFCircleLoader color="primary" />
              </Grid>
            )}
            <div ref={observerRef}></div>
            <Grid item>{isFetching}</Grid>
          </Timeline>
        </>
      )}
    </Paper>
  );
};
