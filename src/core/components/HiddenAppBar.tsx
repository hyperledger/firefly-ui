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
import { IconButton, Hidden, makeStyles, Box } from '@material-ui/core';
import MenuIcon from 'mdi-react/MenuIcon';
import { ReactComponent as LogoIconSVG } from '../svg/ff-logo-white-full.svg';

type Props = {
  navigationOpen: boolean;
  setNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const HiddenAppBar: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
}) => {
  const classes = useStyles();

  return (
    <Hidden implementation="css" mdUp>
      <Box className={classes.container}>
        <div className={classes.item}>
          <IconButton
            className={classes.navIcon}
            size="small"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <MenuIcon />
          </IconButton>
          <LogoIconSVG className={classes.logo} />
        </div>
      </Box>
    </Hidden>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 3),
    height: theme.mixins.toolbar.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
  },
  navIcon: {
    color: theme.palette.text.primary,
    marginRight: theme.spacing(1),
  },
  logo: {
    width: 100,
    height: 50,
  },
}));
