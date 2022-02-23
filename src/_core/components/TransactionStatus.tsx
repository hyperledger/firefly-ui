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

import { Grid, Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ITransactionStatus } from '../interfaces';
import dayjs from 'dayjs';
import { HashPopover } from '../../components/Popovers/HashPopover';
import { DEFAULT_SPACING } from '../../theme';

interface Props {
  status: ITransactionStatus;
}

export const TransactionStatus: React.FC<Props> = ({ status }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <Typography fontWeight="bold">{t('details')}</Typography>
      <Grid container spacing={DEFAULT_SPACING} paddingTop={2}>
        {status.details.map((item) => (
          <React.Fragment key={item.id}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={2}>
                  <Grid container item justifyContent="space-between">
                    <Grid item>
                      <Typography color="white">{item.type}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography color="white">{item.status}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container item justifyContent="space-between">
                    <Grid item>
                      {item.id ? (
                        <HashPopover address={item.id} paper />
                      ) : undefined}
                    </Grid>
                    {item.timestamp && (
                      <Grid item>
                        <Typography color="white">
                          {dayjs(item.timestamp).format('MM/DD/YYYY h:mm A')}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
  },
}));
