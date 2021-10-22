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

import { IRoute, ModuleNav, NavItem } from '../../core/interfaces';
import ViewDashboardOutlineIcon from 'mdi-react/ViewDashboardOutlineIcon';
import GoogleCirclesExtendedIcon from 'mdi-react/GoogleCirclesExtendedIcon';
import DomainIcon from 'mdi-react/DomainIcon';
import useModuleTranslation from '../../core/hooks/useModuleTranslation';
import i18n from 'i18next';
import enData from './translations/en.json';
import WebIcon from 'mdi-react/WebIcon';
import { Dashboard } from './views/Dashboard';
import { Organizations } from './views/Organizations';
import { Nodes } from './views/Nodes';

const NETWORK_MAP_ROUTE_PREFIX = '/network-map';

// Translations

export const NETWORK_MAP_TRANSLATIONS_NS = 'network-map';
export const registerNetworkMapTranslations = (): void => {
  i18n.addResourceBundle('en', NETWORK_MAP_TRANSLATIONS_NS, enData);
};
export const useNetworkMapTranslation = (): { t: (key: string) => string } => {
  return useModuleTranslation(NETWORK_MAP_TRANSLATIONS_NS);
};

// Navigation

const makeNetworkMapPathname = (_ns?: string, pathSuffix?: string): string =>
  `${NETWORK_MAP_ROUTE_PREFIX}${pathSuffix || ''}`;

export const NetworkMapAppNavItem: NavItem = {
  translationNs: NETWORK_MAP_TRANSLATIONS_NS,
  translationKey: 'networkMap',
  description: 'networkMapDescription',
  icon: WebIcon,
  routesRequireNamespace: false,
  makePathname: makeNetworkMapPathname,
  isActiveCheck: (_ns?: string, pathname?: string) =>
    pathname?.startsWith(makeNetworkMapPathname()) || false,
};

export const NetworkMapModuleNav: ModuleNav = {
  makeModulePathnamePrefix: makeNetworkMapPathname,
  includeNamespacePicker: NetworkMapAppNavItem.routesRequireNamespace,
  routesRequireNamespace: NetworkMapAppNavItem.routesRequireNamespace,
  translationNs: NETWORK_MAP_TRANSLATIONS_NS,
  translationKey: 'networkMap',
  navItems: [
    {
      translationNs: NETWORK_MAP_TRANSLATIONS_NS,
      translationKey: 'dashboard',
      icon: ViewDashboardOutlineIcon,
      routesRequireNamespace: NetworkMapAppNavItem.routesRequireNamespace,
      makePathname: makeNetworkMapPathname,
      isActiveCheck: (_ns?: string, pathname?: string) =>
        pathname === makeNetworkMapPathname(),
    },
    {
      translationNs: NETWORK_MAP_TRANSLATIONS_NS,
      translationKey: 'organizations',
      icon: DomainIcon,
      routesRequireNamespace: NetworkMapAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) =>
        makeNetworkMapPathname(ns, '/organizations'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeNetworkMapPathname(ns, '/organizations')) ||
        false,
    },
    {
      translationNs: NETWORK_MAP_TRANSLATIONS_NS,
      translationKey: 'nodes',
      icon: GoogleCirclesExtendedIcon,
      routesRequireNamespace: NetworkMapAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeNetworkMapPathname(ns, '/nodes'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeNetworkMapPathname(ns, '/nodes')) || false,
    },
  ],
};

// Routes

export const NetworkMapRoutes: IRoute[] = [
  {
    exact: true,
    route: `${NETWORK_MAP_ROUTE_PREFIX}`,
    component: Dashboard,
  },
  {
    exact: true,
    route: `${NETWORK_MAP_ROUTE_PREFIX}/organizations`,
    component: Organizations,
  },
  {
    exact: true,
    route: `${NETWORK_MAP_ROUTE_PREFIX}/nodes`,
    component: Nodes,
  },
];
