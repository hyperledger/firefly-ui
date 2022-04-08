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

import { Grid, Typography } from '@mui/material';
import React from 'react';
import { DEFAULT_PADDING } from '../../theme';
import { FFArrowButton } from '../Buttons/FFArrowButton';

interface Props {
  clickPath?: string;
  title: string;
}

export const SlideSectionHeader: React.FC<Props> = ({ clickPath, title }) => {
  return (
    <Grid
      container
      item
      py={DEFAULT_PADDING}
      direction="row"
      alignItems="center"
    >
      <Grid item xs={6}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            fontSize: '12',
          }}
        >
          {title}
        </Typography>
      </Grid>
      {clickPath && (
        <Grid item xs={6} container justifyContent="flex-end">
          <FFArrowButton link={clickPath} />
        </Grid>
      )}
    </Grid>
  );
};
