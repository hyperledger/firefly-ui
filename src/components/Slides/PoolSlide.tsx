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
import Jazzicon from 'react-jazzicon';
import { useParams } from 'react-router-dom';
import { ITokenPool } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { jsNumberForAddress } from '../../utils';
import { PoolList } from '../Lists/PoolList';
import { DisplaySlide } from './DisplaySlide';

interface Props {
  pool: ITokenPool;
  open: boolean;
  onClose: () => void;
}

export const PoolSlide: React.FC<Props> = ({ pool, open, onClose }) => {
  const { poolID } = useParams<{ poolID: string }>();

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <Grid item pb={DEFAULT_PADDING}>
            <Typography variant="subtitle1">{`${
              pool.standard
            } - ${pool.type.toLocaleUpperCase()}`}</Typography>
            <Grid
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              container
              pt={DEFAULT_PADDING}
            >
              <Grid container item justifyContent="flex-start" xs={1}>
                <Jazzicon diameter={34} seed={jsNumberForAddress(pool.name)} />
              </Grid>
              <Grid container item justifyContent="flex-start" xs={11}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14',
                  }}
                >
                  {pool.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Data list */}
          <Grid container item pb={DEFAULT_PADDING}>
            <PoolList pool={pool} showPoolLink={pool.id !== poolID} />
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};
