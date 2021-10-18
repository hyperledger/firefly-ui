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
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { ReactComponent as LogoIconSVG } from '../svg/HyperledgerFireFly-Logo-White.svg';

type Props = {
  navigationOpen?: boolean;
  setNavigationOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuLogo: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.item}>
      <IconButton
        color="inherit"
        className={classes.icon}
        size="small"
        onClick={() =>
          setNavigationOpen ? setNavigationOpen(!navigationOpen) : {}
        }
      >
        {navigationOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <LogoIconSVG className={classes.logo} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  logo: {
    width: 125,
    height: 75,
  },
}));
