// Copyright © 2021 Kaleido, Inc.
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
import { makeStyles, Paper, Typography, Grid } from '@material-ui/core';
import clsx from 'clsx';

interface Props {
  title?: string;
  description?: string;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
}

export const TimelineContentPanel: React.FC<Props> = ({
  title,
  description,
  onClick,
  color = 'primary',
}) => {
  const classes = useStyles();

  return (
    <>
      <Paper
        elevation={3}
        className={clsx(
          classes.paper,
          onClick && classes.clickable,
          color === 'primary' ? classes.borderPrimary : classes.borderSecondary
        )}
        onClick={onClick}
      >
        <Grid container className={classes.container} direction="column">
          <Grid className={classes.titleContainer} item>
            <Typography noWrap className={classes.title}>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.description}>
              {description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.timelineBackground.main,
  },
  titleContainer: {
    maxWidth: 220,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  description: {
    fontSize: 12,
  },
  container: {
    alignItems: 'flex-start',
  },
  clickable: {
    cursor: 'pointer',
  },
  borderPrimary: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  borderSecondary: {
    borderLeft: `4px solid ${theme.palette.secondary.main}`,
  },
}));
