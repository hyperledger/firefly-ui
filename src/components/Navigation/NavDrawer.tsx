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

import { Drawer, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile?: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
};

export const NavDrawer: React.FC<Props> = ({
  open,
  setOpen,
  isMobile = false,
  children,
  setIsMobile,
}: Props) => {
  const classes = useStyles();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
      setIsMobile(true);
    }
  }, [isMobile, setOpen, setIsMobile]);

  return (
    <Drawer
      variant={isMobile ? undefined : 'permanent'}
      {...{ open }}
      onClose={() => setOpen(false)}
      anchor="left"
      className={classes.drawerOpen}
      classes={{
        paper: classes.drawerOpen,
        paperAnchorDockedLeft: classes.drawerBorder,
      }}
    >
      {children}
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
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
