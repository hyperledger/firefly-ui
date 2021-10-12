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

import { Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHomeTranslation } from '../registration';

export const Home: () => JSX.Element = () => {
  const classes = useStyles();
  const { t } = useHomeTranslation();

  return (
    <Grid container justifyContent="center">
      <Grid container item wrap="nowrap" direction="column">
        <Grid container item direction="row">
          <Grid className={classes.headerContainer} item>
            <Typography variant="h4" className={classes.header}>
              {t('home')}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            The Home dashboard is coming soon. Use the menu on the left to
            navigate to specific modules.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: theme.spacing(5),
  },
}));
