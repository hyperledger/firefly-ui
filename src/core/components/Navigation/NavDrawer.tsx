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

import { Drawer, Toolbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';
import { MenuLogo } from '../MenuLogo';

type Props = {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isPermanentDrawer?: boolean;
  children: JSX.Element;
};

export const NavDrawer: React.FC<Props> = ({
  open,
  setOpen,
  isPermanentDrawer = false,
  children,
}: Props) => {
  const classes = useStyles();

  return (
    <Drawer
      sx={{
        zIndex: (theme) =>
          !isPermanentDrawer
            ? theme.zIndex.appBar + 1
            : theme.zIndex.appBar - 1,
      }}
      color="primary"
      variant={isPermanentDrawer ? 'permanent' : undefined}
      open={isPermanentDrawer ? true : open}
      onClose={() => (setOpen ? setOpen(false) : {})}
      anchor="left"
      transitionDuration={0}
      className={!isPermanentDrawer ? classes.drawerOpen : undefined}
      BackdropProps={{ invisible: true }}
      classes={{
        paper: clsx(classes.drawerOpen, !isPermanentDrawer && classes.appNav),
        paperAnchorDockedLeft: classes.drawerBorder,
      }}
    >
      <Toolbar>
        <MenuLogo navigationOpen={open} setNavigationOpen={setOpen} />
      </Toolbar>
      {children}
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  appNav: {
    backgroundColor: 'black',
  },
  drawerBorder: {
    borderRight: 0,
  },
  drawerOpen: {
    width: 220,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));
