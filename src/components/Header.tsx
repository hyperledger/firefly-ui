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
  AppBar as MaterialAppBar,
  Box,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { DatePicker } from './Pickers/DatePicker';
import { DEFAULT_PADDING, themeOptions } from '../theme';
import { NamespacePicker } from './Pickers/NamespacePicker';
interface Props {
  title: string;
  subtitle: string;
}

export const Header: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <Box display="flex" p={DEFAULT_PADDING}>
      <CssBaseline />
      <MaterialAppBar
        position="relative"
        sx={{
          background: themeOptions.palette?.background?.default,
          boxShadow: 'none',
        }}
      >
        <Toolbar disableGutters>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="subtitle1">{subtitle}</Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14',
                }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid justifyContent="space-evenly" alignItems="center">
              <DatePicker />
              <NamespacePicker />
            </Grid>
          </Grid>
        </Toolbar>
      </MaterialAppBar>
    </Box>
  );
};
