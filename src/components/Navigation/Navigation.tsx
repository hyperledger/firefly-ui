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

import React, { useState, useContext } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Hidden,
  Collapse,
} from '@material-ui/core';
import clsx from 'clsx';
import CubeOutlineIcon from 'mdi-react/CubeOutlineIcon';
import TextBoxCheckOutlineIcon from 'mdi-react/TextBoxCheckOutlineIcon';
import ViewDashboardOutlineIcon from 'mdi-react/ViewDashboardOutlineIcon';
import MessageTextIcon from 'mdi-react/MessageTextIcon';
import CogOutlineIcon from 'mdi-react/CogOutlineIcon';
import WebIcon from 'mdi-react/WebIcon';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { MdiReactIconComponentType } from 'mdi-react';
import { NavDrawer } from './NavDrawer';
import { ReactComponent as LogoIconSVG } from '../../svg/ff-logo-white-full.svg';
import { IRouterParams } from '../../interfaces';
import { NamespacePicker } from './NamespacePicker';
import { NamespaceContext } from '../../contexts/NamespaceContext';

type Props = {
  navigationOpen: boolean;
  setNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Navigation: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const relpath = pathname.replace(/^\//, '');
  const { namespace } = useParams<IRouterParams>();
  const { selectedNamespace } = useContext(NamespaceContext);

  const icons: { [name: string]: MdiReactIconComponentType } = {
    dashboard: ViewDashboardOutlineIcon,
    network: WebIcon,
    messages: MessageTextIcon,
    data: CubeOutlineIcon,
    transactions: TextBoxCheckOutlineIcon,
    settings: CogOutlineIcon,
  };

  const navItem = (
    name: string,
    includeNamespace = true,
    isDefault?: boolean
  ) => {
    const Icon = icons[name];
    const isActive =
      relpath.includes(name) ||
      (isDefault && relpath === `namespace/${selectedNamespace}`);
    const ns = namespace ? namespace : selectedNamespace;

    return (
      <ListItem
        className={clsx(classes.menuItem, isActive && classes.highlightedItem)}
        button
        onClick={() => {
          history.push(
            `${includeNamespace ? `/namespace/${ns}` : ''}${
              isDefault ? '' : `/${name}`
            }`
          );
          if (isMobile) setNavigationOpen(false);
        }}
      >
        <ListItemIcon
          classes={{
            root: classes.closerText,
          }}
        >
          <Icon className={isActive ? classes.highlightedIcon : classes.icon} />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            noWrap: true,
            className: classes.navFont,
          }}
          primary={t(name)}
        />
      </ListItem>
    );
  };

  const drawerContent = (
    <>
      <Box className={classes.logoContainer}>
        <LogoIconSVG className={classes.logo} />
      </Box>
      <Collapse in>
        <NamespacePicker />
        <List>
          {navItem('dashboard', true, true)}
          {navItem('messages')}
          {navItem('data')}
          {navItem('transactions')}
        </List>
      </Collapse>
    </>
  );

  return (
    <>
      <Hidden smDown implementation="js">
        <NavDrawer
          open={navigationOpen}
          setOpen={setNavigationOpen}
          setIsMobile={setIsMobile}
        >
          {drawerContent}
        </NavDrawer>
      </Hidden>
      <Hidden mdUp implementation="js">
        <NavDrawer
          open={navigationOpen}
          setOpen={setNavigationOpen}
          setIsMobile={setIsMobile}
          isMobile
        >
          {drawerContent}
        </NavDrawer>
      </Hidden>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  logo: {
    width: 120,
  },
  fullLogo: {
    width: 140,
  },
  logoContainer: {
    textAlign: 'center',
  },
  menuItem: {
    height: 50,
  },
  closerText: {
    minWidth: 40,
  },
  navFont: {
    fontSize: 16,
  },
  highlightedIcon: {
    color: theme.palette.text.primary,
  },
  icon: {
    color: theme.palette.action.disabled,
  },
  highlightedItem: {
    backgroundColor: theme.palette.background.default,
  },
}));
