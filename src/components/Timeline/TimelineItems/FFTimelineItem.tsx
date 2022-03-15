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
  TimelineConnector,
  TimelineContent,
  TimelineItem as TItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Grid } from '@mui/material';
import React from 'react';
import { ITimelineElement } from '../../../interfaces';
import { FFTimelineLine } from '../../../theme';
import { TimelineLine } from './TimelineLine';

interface Props {
  element: ITimelineElement;
}

export const FFTimelineItem: React.FC<Props> = ({ element }) => {
  return (
    <>
      <TItem>
        <TimelineOppositeContent sx={{ paddingRight: '0' }} />
        <TimelineSeparator>
          <TimelineConnector sx={{ backgroundColor: FFTimelineLine }} />
        </TimelineSeparator>
        <TimelineContent sx={{ paddingLeft: '0', height: '10%' }}>
          <Grid container justifyContent="flex-start" alignItems="center">
            <Grid item xs={1}>
              <TimelineLine />
            </Grid>
            <Grid item xs={11}>
              {element.item}
            </Grid>
          </Grid>
        </TimelineContent>
      </TItem>
    </>
  );
};
