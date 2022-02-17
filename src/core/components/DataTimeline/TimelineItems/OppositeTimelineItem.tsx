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
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { ITimelineItem } from '../../../interfaces';
import { TimelineContentPanel } from './TimelineContentPanel';

interface Props {
  item: ITimelineItem;
}

export const OppositeTimelineItem: React.FC<Props> = ({ item }) => {
  const classes = useStyles();

  return (
    <>
      <TimelineItem>
        <TimelineOppositeContent>
          <TimelineContentPanel
            title={item.title}
            description={item.description}
            onClick={item.onClick}
          />
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot className={classes.dot}>
            {item.icon ? item.icon : undefined}
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>{item.time}</TimelineContent>
      </TimelineItem>
    </>
  );
};

const useStyles = makeStyles(() => ({
  dot: {
    backgroundColor: '#2D353C',
  },
}));
