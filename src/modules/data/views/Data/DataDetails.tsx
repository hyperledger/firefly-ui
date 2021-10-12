// Copyright © 2021 Kaleido, Inc.
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
import { DisplaySlide } from '../../../../core/components/Display/DisplaySlide';
import { Typography, Grid, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { IData } from '../../../../core/interfaces';
import Highlight from 'react-highlight';
import { useDataTranslation } from '../../registration';

interface Props {
  data: IData;
  open: boolean;
  onClose: () => void;
}

export const DataDetails: React.FC<Props> = ({ data, open, onClose }) => {
  const { t } = useDataTranslation();
  const classes = useStyles();

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column">
          <Grid className={classes.headerContainer} item>
            <Typography className={classes.header}>
              {t('dataDetails')}
            </Typography>
          </Grid>
          <Grid container className={classes.dataContainer} item>
            <Grid item>
              <Paper className={classes.paper}>
                <Highlight>{JSON.stringify(data.value, null, 2)}</Highlight>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  detailsContainer: {
    padding: theme.spacing(3),
  },
  detailItem: {
    paddingBottom: theme.spacing(1),
  },
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  detailLabel: {
    fontSize: 10,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
  },
  divider: {
    backgroundColor: theme.palette.background.default,
    height: 2,
  },
  copyButton: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: 20,
    fontSize: 10,
  },
  paddingRight: {
    paddingRight: theme.spacing(1),
  },
  centeredContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  paper: {
    backgroundColor: theme.palette.background.default,
    minWidth: '40vw',
  },
  dataContainer: {
    overflow: 'auto',
  },
}));
