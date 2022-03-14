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

import React, { useContext } from 'react';
import { Paper, Avatar, Tooltip, CircularProgress, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Timeline } from '@mui/lab';
import { TimelineItemWrapper } from './TimelineItemWrapper';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITimelineItem } from '../../interfaces';

interface Props {
  items: ITimelineItem[];
  observerRef?: React.MutableRefObject<HTMLDivElement | null>;
  isFetching?: boolean;
}

export const DataTimeline: React.FC<Props> = ({
  items,
  observerRef,
  isFetching,
}) => {
  const classes = useStyles();
  const { identity, orgName } = useContext(ApplicationContext);

  const determineOpposite = (author: string | undefined) => {
    if (!author) return true;
    if (author === identity) return true;
    return false;
  };

  return (
    <>
      <Paper className={classes.paper}>
        <Tooltip title={orgName}>
          <Avatar className={classes.avatar} alt={orgName}>
            {orgName.charAt(0)}
          </Avatar>
        </Tooltip>
        <Timeline>
          {items.map((item) => (
            <TimelineItemWrapper
              key={item.key}
              item={item}
              opposite={determineOpposite(item.author)}
            />
          ))}
          {isFetching && (
            <Grid item className={classes.loading}>
              <CircularProgress className={classes.loading} />
            </Grid>
          )}
          <div ref={observerRef}></div>
        </Timeline>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    width: '100%',
    maxHeight: 'calc(100vh - 100px)',
    overflow: 'auto',
  },
  avatar: {
    textTransform: 'uppercase',
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.text.primary,
  },
  loading: {
    margin: theme.spacing(1),
    textAlign: 'center',
  },
}));
