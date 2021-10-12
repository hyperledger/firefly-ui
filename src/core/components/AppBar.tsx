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
import {
  IconButton,
  Box,
  CssBaseline,
  Toolbar,
  AppBar as MaterialAppBar,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CogOutlineIcon from 'mdi-react/CogOutlineIcon';
import BellOutlineIcon from 'mdi-react/BellOutlineIcon';
import { MenuLogo } from './MenuLogo';

type Props = {
  navigationOpen: boolean;
  setNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppBar: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
}) => {
  const classes = useStyles();

  return (
    <Box display="flex">
      <CssBaseline />
      <MaterialAppBar position="fixed">
        <Toolbar>
          <MenuLogo
            navigationOpen={navigationOpen}
            setNavigationOpen={setNavigationOpen}
          />
          <div className={classes.rightSideIcons}>
            <IconButton
              className={classes.icon}
              color="inherit"
              size="small"
              onClick={() => alert('pop settings')}
            >
              <CogOutlineIcon />
            </IconButton>
            <IconButton
              className={classes.icon}
              color="inherit"
              size="small"
              onClick={() => alert('pop notifications')}
            >
              <BellOutlineIcon />
            </IconButton>
          </div>
        </Toolbar>
      </MaterialAppBar>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  rightSideIcons: {
    marginLeft: 'auto',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
}));
