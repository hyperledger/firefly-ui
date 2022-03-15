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

import { Divider, Grid, Typography } from '@mui/material';
import React from 'react';
import { FFTimelineLine } from '../../theme';

interface Props {
  leftHeader: string;
  rightHeader: string;
}

export const FFTimelineHeader: React.FC<Props> = ({
  leftHeader,
  rightHeader,
}) => {
  return (
    <>
      <Grid
        container
        item
        direction="row"
        sx={{ backgroundColor: 'background.paper', padding: '0px 0px 0px 0px' }}
      >
        <Grid
          xs={6}
          container
          item
          justifyContent="center"
          borderRight={`1px solid ${FFTimelineLine}`}
          height="100%"
          py="16px"
        >
          <Typography
            height="100%"
            fontSize="12"
            variant="caption"
            fontWeight="bold"
          >
            {leftHeader}
          </Typography>
        </Grid>
        <Grid
          xs={6}
          container
          item
          justifyContent="center"
          borderLeft={`1px solid ${FFTimelineLine}`}
          height="100%"
          py="16px"
        >
          <Typography fontSize="12" variant="caption" fontWeight="bold">
            {rightHeader}
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
    </>
  );
};
