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

import { Grid, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

interface Props {
  header?: string;
  message?: string;
}

export const DataTableEmptyState: React.FC<Props> = ({ header, message }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      {header && (
        <Grid container justifyContent="space-between" direction="row">
          <Grid item>
            <Typography className={classes.header}>{header}</Typography>
          </Grid>
        </Grid>
      )}
      {message && (
        <Grid container justifyContent="center">
          <Typography>{message}</Typography>
        </Grid>
      )}
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 'bold',
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(3),
  },
}));
