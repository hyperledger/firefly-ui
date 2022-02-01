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

import i18n from 'i18next';
import CalendarIcon from 'mdi-react/CalendarIcon';
import CubeOutlineIcon from 'mdi-react/CubeOutlineIcon';
import FileTableOutlineIcon from 'mdi-react/FileTableOutlineIcon';
import MessageTextIcon from 'mdi-react/MessageTextIcon';
import TextBoxCheckOutlineIcon from 'mdi-react/TextBoxCheckOutlineIcon';
import ViewDashboardOutlineIcon from 'mdi-react/ViewDashboardOutlineIcon';
import useModuleTranslation from '../../core/hooks/useModuleTranslation';
import { IRoute, ModuleNav, NavItem } from '../../core/interfaces';
import enData from './translations/en.json';
import { Dashboard } from './views/Dashboard';
import { Data } from './views/Data/Data';
import { Events } from './views/Events/Events';
import { MessageDetails } from './views/Messages/MessageDetails';
import { Messages } from './views/Messages/Messages';
import { Transactions } from './views/Transactions/Transactions';
import { Types } from './views/Types/Types';

// Translations

export const DATA_TRANSLATIONS_NS = 'data';
export const registerDataTranslations = (): void => {
  i18n.addResourceBundle('en', DATA_TRANSLATIONS_NS, enData);
};
export const useDataTranslation = (): { t: (key: string) => string } => {
  return useModuleTranslation(DATA_TRANSLATIONS_NS);
};

// Navigation

const makeDataPathname = (ns?: string, pathSuffix?: string): string =>
  `/namespace/${ns}/data${pathSuffix || ''}`;

export const DataAppNavItem: NavItem = {
  translationNs: DATA_TRANSLATIONS_NS,
  translationKey: 'dataExplorer',
  icon: CubeOutlineIcon,
  description: 'dataExplorerDescription',
  routesRequireNamespace: true,
  makePathname: makeDataPathname,
  isActiveCheck: (ns?: string, pathname?: string) =>
    pathname?.startsWith(makeDataPathname(ns)) || false,
};

export const DataModuleNav: ModuleNav = {
  makeModulePathnamePrefix: makeDataPathname,
  includeNamespacePicker: true,
  routesRequireNamespace: DataAppNavItem.routesRequireNamespace,
  translationNs: DATA_TRANSLATIONS_NS,
  translationKey: 'dataExplorer',
  navItems: [
    {
      translationNs: DATA_TRANSLATIONS_NS,
      translationKey: 'dashboard',
      icon: ViewDashboardOutlineIcon,
      routesRequireNamespace: DataAppNavItem.routesRequireNamespace,
      makePathname: makeDataPathname,
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname === makeDataPathname(ns),
    },
    {
      translationNs: DATA_TRANSLATIONS_NS,
      translationKey: 'messages',
      icon: MessageTextIcon,
      routesRequireNamespace: DataAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeDataPathname(ns, '/messages'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeDataPathname(ns, '/messages')) || false,
    },
    {
      translationNs: DATA_TRANSLATIONS_NS,
      translationKey: 'data',
      icon: CubeOutlineIcon,
      routesRequireNamespace: DataAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeDataPathname(ns, '/data'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeDataPathname(ns, '/data')) || false,
    },
    {
      translationNs: DATA_TRANSLATIONS_NS,
      translationKey: 'transactions',
      icon: TextBoxCheckOutlineIcon,
      routesRequireNamespace: DataAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeDataPathname(ns, '/transactions'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeDataPathname(ns, '/transactions')) || false,
    },
    {
      translationNs: DATA_TRANSLATIONS_NS,
      translationKey: 'events',
      icon: CalendarIcon,
      routesRequireNamespace: DataAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeDataPathname(ns, '/events'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeDataPathname(ns, '/events')) || false,
    },
    {
      translationNs: DATA_TRANSLATIONS_NS,
      translationKey: 'dataTypes',
      icon: FileTableOutlineIcon,
      routesRequireNamespace: DataAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeDataPathname(ns, '/types'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeDataPathname(ns, '/types')) || false,
    },
  ],
};

// Routes

const DATA_ROUTE_PREFIX = '/namespace/:namespace/data';
export const DataRoutes: IRoute[] = [
  {
    exact: true,
    route: `${DATA_ROUTE_PREFIX}`,
    component: Dashboard,
  },
  {
    exact: true,
    route: `${DATA_ROUTE_PREFIX}/data`,
    component: Data,
  },
  {
    exact: true,
    route: `${DATA_ROUTE_PREFIX}/messages`,
    component: Messages,
  },
  {
    exact: true,
    route: `${DATA_ROUTE_PREFIX}/messages/:id`,
    component: MessageDetails,
  },
  {
    exact: true,
    route: `${DATA_ROUTE_PREFIX}/transactions`,
    component: Transactions,
  },
  {
    exact: true,
    route: `${DATA_ROUTE_PREFIX}/events`,
    component: Events,
  },
  {
    exact: true,
    route: `${DATA_ROUTE_PREFIX}/types`,
    component: Types,
  },
];
