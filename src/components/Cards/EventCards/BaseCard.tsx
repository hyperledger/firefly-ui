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

import LaunchIcon from '@mui/icons-material/Launch';
import { Grid, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_BORDER_RADIUS,
  FFBackgroundHover,
  FFColors,
  FFTimelineLineHover,
} from '../../../theme';

interface Props {
  title?: string;
  description?: string;
  status?: string | JSX.Element;
  timestamp?: string;
  color?: string;
  onClick?: () => void;
  link?: string;
  linkState?: any;
}

export const BaseCard: React.FC<Props> = ({
  title,
  description,
  status,
  timestamp,
  color,
  onClick,
  link,
  linkState,
}) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'background.default',
        borderRadius: DEFAULT_BORDER_RADIUS,
        width: '100%',
      }}
    >
      <Grid
        direction="row"
        container
        sx={{
          borderRadius: DEFAULT_BORDER_RADIUS,
          borderLeft: `${DEFAULT_BORDER_RADIUS} solid ${color}`,
        }}
      >
        <Grid
          sx={{
            '&:hover': {
              backgroundColor: onClick && FFTimelineLineHover,
              cursor: onClick && 'pointer',
              color: onClick && FFBackgroundHover,
              borderTopRightRadius: DEFAULT_BORDER_RADIUS,
              borderBottomRightRadius: DEFAULT_BORDER_RADIUS,
            },
          }}
          container
          alignItems="center"
          direction="row"
          p={1}
          onClick={onClick}
        >
          <Grid container item alignItems="center" direction="row">
            <Grid
              xs={6}
              container
              item
              direction="row"
              justifyContent="flex-start"
            >
              <Typography noWrap fontSize={14}>
                {title}
              </Typography>
            </Grid>
            <Grid
              xs={6}
              container
              item
              direction="row"
              justifyContent="flex-end"
            >
              <Grid item pr={1}>
                {status}
              </Grid>
              {link && (
                <IconButton
                  size="small"
                  onClick={() => navigate(link, linkState ?? undefined)}
                  sx={{
                    elevation: 0,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: FFColors.Purple,
                      cursor: onClick && 'pointer',
                    },
                  }}
                >
                  <LaunchIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            item
            alignItems="center"
          >
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
      </Grid>
    </Paper>
  );
};
