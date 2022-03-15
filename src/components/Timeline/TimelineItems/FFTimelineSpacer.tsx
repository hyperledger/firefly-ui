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

import { Grid } from '@mui/material';

interface Props {
  color: string;
}

export const FFTimelineSpacer: React.FC<Props> = ({ color }) => {
  return (
    <Grid container item direction="row" sx={{ height: '34px' }}>
      <Grid
        item
        sx={{
          borderRight: `1px solid ${color}`,
          height: '100%',
        }}
        xs={6}
      ></Grid>
      <Grid
        item
        sx={{
          borderLeft: `1px solid ${color}`,
          height: '100%',
        }}
        xs={6}
      ></Grid>
    </Grid>
  );
};
