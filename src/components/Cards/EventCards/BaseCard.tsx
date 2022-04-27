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
import { DEFAULT_BORDER_RADIUS } from '../../../theme';

interface Props {
  title?: string;
  description?: string;
  status?: string | JSX.Element;
  timestamp?: string;
  color?: string;
  onClick?: () => void;
  link?: string;
}

export const BaseCard: React.FC<Props> = ({
  title,
  description,
  status,
  timestamp,
  color,
  onClick,
  link,
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
              backgroundColor: onClick && 'primary.main',
              cursor: onClick && 'pointer',
              color: onClick && 'secondary.dark',
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
          <Grid
            container
            item
            alignItems="center"
            direction="row"
            justifyContent={'space-between'}
          >
            <Grid item justifyContent="flex-start">
              <Typography noWrap fontSize={14}>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              {status}
              {link && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(link);
                  }}
                  color="primary"
                  sx={{
                    elevation: 0,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'success.main',
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
            <Grid
              xs={8}
              container
              item
              direction="row"
              justifyContent="flex-start"
            >
              <Typography noWrap color="secondary" fontSize={12}>
                {description}
              </Typography>
            </Grid>
            <Grid
              xs={4}
              container
              item
              direction="row"
              justifyContent="flex-end"
            >
              <Typography noWrap color="secondary" fontSize={12}>
                {timestamp}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
