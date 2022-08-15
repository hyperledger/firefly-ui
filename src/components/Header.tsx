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
  Button,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../contexts/ApplicationContext';
import { DEFAULT_PADDING } from '../theme';
import { DatePicker } from './Pickers/DatePicker';
import { NamespacePicker } from './Pickers/NamespacePicker';

interface Props {
  title: string | JSX.Element;
  subtitle: string;
  onRefresh?: any;
  showRefreshBtn?: boolean;
  noDateFilter?: boolean;
  noNsFilter?: boolean;
}

export const Header: React.FC<Props> = ({
  title,
  subtitle,
  onRefresh,
  showRefreshBtn = false,
  noDateFilter = false,
  noNsFilter = false,
}) => {
  const { nodeName } = useContext(ApplicationContext);
  const { t } = useTranslation();

  return (
    <Box display="flex" px={DEFAULT_PADDING} pt={DEFAULT_PADDING}>
      <CssBaseline />
      <MaterialAppBar
        elevation={0}
        position="relative"
        sx={{
          backgroundColor: 'background.default',
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
            <Grid direction="column" container xs={6} item>
              <Typography color="primary" variant="subtitle1">
                {subtitle}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '14',
                }}
                color="primary"
              >
                {title}
              </Typography>
            </Grid>
            <Grid
              xs={6}
              container
              item
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item pr={1}>
                {showRefreshBtn && (
                  <Button
                    onClick={onRefresh}
                    variant="contained"
                    color="info"
                    sx={{ borderRadius: '16px' }}
                  >
                    <Typography sx={{ fontSize: '14px' }}>
                      {t('refresh')}
                    </Typography>
                  </Button>
                )}
              </Grid>
              <Grid item>{!noDateFilter && <DatePicker />}</Grid>
              <Grid item>{!noNsFilter && <NamespacePicker />}</Grid>
              <Grid item pl={DEFAULT_PADDING}>
                <Typography noWrap variant="subtitle1">
                  {nodeName !== undefined ? nodeName : ''}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </MaterialAppBar>
    </Box>
  );
};
