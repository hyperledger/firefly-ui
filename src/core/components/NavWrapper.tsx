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

import React, { useContext, useState } from 'react';
import { Toolbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { AppBar } from './AppBar';
import clsx from 'clsx';
import { NavContent } from './Navigation/NavContent';
import { IRouterParams, ModuleNav, NavItem } from '../interfaces';
import {
  registerAppNavigationItems,
  registerModuleNavigationItems,
} from '../../modules/registration/navigation';
import { useLocation, useParams } from 'react-router';
import { NamespaceContext } from '../contexts/NamespaceContext';
import { useTranslation } from 'react-i18next';

export const NavWrapper: React.FC = ({ children }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { namespace: routerNamespace } = useParams<IRouterParams>();
  const { selectedNamespace } = useContext(NamespaceContext);
  const namespace = routerNamespace || selectedNamespace;

  const [navigationOpen, setNavigationOpen] = useState(false);

  const navItems: NavItem[] = registerAppNavigationItems();
  const moduleNavs: ModuleNav[] = registerModuleNavigationItems();

  const moduleNav = moduleNavs.find((m) =>
    pathname.startsWith(
      m.makeModulePathnamePrefix(
        m.routesRequireNamespace ? namespace : undefined
      )
    )
  );

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <AppBar
          navigationOpen={navigationOpen}
          setNavigationOpen={setNavigationOpen}
        />
        <NavContent
          navigationOpen={navigationOpen}
          setNavigationOpen={setNavigationOpen}
          includeNamespacePicker={false}
          isPermanentDrawer={false}
          navItems={navItems}
        />
        {moduleNav && (
          <NavContent
            includeNamespacePicker={moduleNav.includeNamespacePicker}
            isPermanentDrawer={true}
            navItems={moduleNav.navItems}
            navTitle={t(
              `${moduleNav.translationNs}:${moduleNav.translationKey}`
            )}
          />
        )}
        <div
          className={clsx(
            classes.panel,
            (navigationOpen || moduleNav) && classes.navShift
          )}
        >
          <Toolbar />
          {children}
        </div>
      </main>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
  },
  shift: {
    marginLeft: '110px',
  },
  panel: {
    paddingTop: theme.spacing(2),
    paddingLeft: 120,
    paddingRight: 120,
    maxWidth: 1920,
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
    },
  },
  navShift: {
    paddingLeft: 260,
    paddingRight: 40,
  },
}));
