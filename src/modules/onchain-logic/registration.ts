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
import FileCodeOutlineIcon from 'mdi-react/FileCodeOutlineIcon';
import ViewDashboardOutlineIcon from 'mdi-react/ViewDashboardOutlineIcon';
import useModuleTranslation from '../../core/hooks/useModuleTranslation';
import { IRoute, ModuleNav, NavItem } from '../../core/interfaces';
import enData from './translations/en.json';
import { Dashboard } from './views/Dashboard';
// Translations

export const ONCHAIN_LOGIC_TRANSLATIONS_NS = 'onchain-logic';
export const registerOnChainLogicTranslations = (): void => {
  i18n.addResourceBundle('en', ONCHAIN_LOGIC_TRANSLATIONS_NS, enData);
};
export const useOnChainLogicTranslation = (): {
  t: (key: string) => string;
} => {
  return useModuleTranslation(ONCHAIN_LOGIC_TRANSLATIONS_NS);
};

// Navigation

const makeOnChainLogicPathname = (ns?: string, pathSuffix?: string): string =>
  `/namespace/${ns}/onchain-logic${pathSuffix || ''}`;

export const OnChainLogicAppNavItem: NavItem = {
  translationNs: ONCHAIN_LOGIC_TRANSLATIONS_NS,
  translationKey: 'onChainLogic',
  icon: FileCodeOutlineIcon,
  description: 'onChainLogicDescription',
  routesRequireNamespace: true,
  makePathname: makeOnChainLogicPathname,
  isActiveCheck: (ns?: string, pathname?: string) =>
    pathname?.startsWith(makeOnChainLogicPathname(ns)) || false,
};

export const OnChainLogicModuleNav: ModuleNav = {
  makeModulePathnamePrefix: makeOnChainLogicPathname,
  includeNamespacePicker: true,
  routesRequireNamespace: OnChainLogicAppNavItem.routesRequireNamespace,
  translationNs: ONCHAIN_LOGIC_TRANSLATIONS_NS,
  translationKey: 'onChainLogic',
  navItems: [
    {
      translationNs: ONCHAIN_LOGIC_TRANSLATIONS_NS,
      translationKey: 'dashboard',
      icon: ViewDashboardOutlineIcon,
      routesRequireNamespace: OnChainLogicAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeOnChainLogicPathname(ns, ''),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname === makeOnChainLogicPathname(ns),
    },
  ],
};

// Routes
const ONCHAIN_LOGIC_ROUTE_PREFIX = '/namespace/:namespace/onchain-logic';
export const OnChainLogicRoutes: IRoute[] = [
  {
    exact: true,
    route: `${ONCHAIN_LOGIC_ROUTE_PREFIX}`,
    component: Dashboard,
  },
];
