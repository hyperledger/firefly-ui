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
import { Paper, Typography, Grid } from '@mui/material';

interface Props {
  title?: string;
  description?: string;
  status?: string | JSX.Element;
  timestamp?: string;
  color?: string;
  onClick?: () => void;
}

export const BaseCard: React.FC<Props> = ({
  title,
  description,
  status,
  timestamp,
  color,
  onClick,
}) => {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : undefined,
        backgroundColor: 'background.default',
        borderLeft: '6px solid',
        borderColor: color,
        padding: 2,
      }}
    >
      <Grid
        container
        sx={{ alignItems: 'flex-start' }}
        direction="column"
        spacing={0.5}
      >
        <Grid container justifyContent="space-between" item alignItems="center">
          <Grid sx={{ maxWidth: 220 }} item>
            <Typography noWrap fontSize={14}>
              {title}
            </Typography>
          </Grid>
          <Grid item>{status}</Grid>
        </Grid>
        <Grid container justifyContent="space-between" item alignItems="center">
          <Grid item>
            <Typography color="text.secondary" fontSize={12}>
              {description}
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="text.secondary" fontSize={12}>
              {timestamp}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
