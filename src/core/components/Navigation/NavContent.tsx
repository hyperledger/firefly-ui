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

import React, { useContext } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { NavDrawer } from './NavDrawer';
import { IRouterParams, NavItem } from '../../interfaces';
import { NamespacePicker } from './NamespacePicker';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { useTranslation } from 'react-i18next';

type Props = {
  navigationOpen?: boolean;
  setNavigationOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  includeNamespacePicker: boolean;
  isPermanentDrawer: boolean;
  navItems: NavItem[];
  navTitle?: string;
};

export const NavContent: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
  includeNamespacePicker,
  isPermanentDrawer,
  navItems,
  navTitle,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const { namespace } = useParams<IRouterParams>();
  const { selectedNamespace } = useContext(NamespaceContext);

  const makeNavItem = (navItem: NavItem) => {
    const ns = namespace ? namespace : selectedNamespace;
    const navItemPath = navItem.makePathname(
      navItem.routesRequireNamespace ? ns : undefined
    );
    const isActive = navItem.isActiveCheck(
      navItem.routesRequireNamespace ? ns : undefined,
      pathname
    );

    return (
      <ListItem
        key={`${navItem.translationNs}:${navItem.translationKey}`}
        className={clsx(classes.menuItem, isActive && classes.highlightedItem)}
        button
        onClick={() => {
          if (navItemPath !== pathname) {
            history.push(navItemPath);
          }
          if (setNavigationOpen) setNavigationOpen(false);
        }}
      >
        <ListItemIcon
          classes={{
            root: classes.closerText,
          }}
        >
          <navItem.icon
            className={isActive ? classes.highlightedIcon : classes.icon}
          />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            noWrap: true,
            className: clsx(
              classes.navFont,
              isActive ? classes.highlightedText : classes.regularText
            ),
          }}
          primary={t(`${navItem.translationNs}:${navItem.translationKey}`)}
        />
      </ListItem>
    );
  };

  const drawerContent = (
    <>
      <Collapse in>
        <List>
          {includeNamespacePicker && <NamespacePicker />}
          {navTitle && (
            <ListItem className={classes.padTitle}>
              <Typography variant="overline">{navTitle}</Typography>
            </ListItem>
          )}
          {navItems.map((ni) => makeNavItem(ni))}
        </List>
      </Collapse>
    </>
  );

  return (
    <NavDrawer
      open={navigationOpen}
      setOpen={setNavigationOpen}
      isPermanentDrawer={isPermanentDrawer}
    >
      {drawerContent}
    </NavDrawer>
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
    color: theme.palette.text.secondary,
  },
  highlightedItem: {
    backgroundColor: theme.palette.background.default,
  },
  highlightedText: {
    color: theme.palette.text.primary,
  },
  regularText: {
    color: theme.palette.text.disabled,
  },
  padTitle: {
    paddingTop: theme.spacing(3),
  },
}));
