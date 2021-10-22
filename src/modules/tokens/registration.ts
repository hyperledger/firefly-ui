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
import AccountBalanceWalletOutlineIcon from 'mdi-react/AccountBalanceWalletOutlineIcon';
import CircleDoubleIcon from 'mdi-react/CircleDoubleIcon';
import SwapHorizontalIcon from 'mdi-react/SwapHorizontalIcon';
import ViewDashboardOutlineIcon from 'mdi-react/ViewDashboardOutlineIcon';
import useModuleTranslation from '../../core/hooks/useModuleTranslation';
import { IRoute, ModuleNav, NavItem } from '../../core/interfaces';
import enTokens from './translations/en.json';
import { Accounts } from './views/Accounts/Accounts';
import { Dashboard } from './views/Dashboard';
import { TokenPoolDetails } from './views/TokenPools/TokenPoolDetails';
import { TokenPools } from './views/TokenPools/TokenPools';
import { Transfers } from './views/Transfers/Transfers';

// Translations
export const TOKENS_TRANSLATIONS_NS = 'tokens';
export const registerTokensTranslations = (): void => {
  i18n.addResourceBundle('en', TOKENS_TRANSLATIONS_NS, enTokens);
};
export const useTokensTranslation = (): { t: (key: string) => string } => {
  return useModuleTranslation(TOKENS_TRANSLATIONS_NS);
};

// Navigation
const makeTokensPathname = (ns?: string, pathSuffix?: string): string =>
  `/namespace/${ns}/tokens${pathSuffix || ''}`;

export const TokensAppNavItem: NavItem = {
  translationNs: TOKENS_TRANSLATIONS_NS,
  translationKey: 'tokens',
  icon: AccountBalanceWalletOutlineIcon,
  routesRequireNamespace: true,
  makePathname: makeTokensPathname,
  isActiveCheck: (ns?: string, pathname?: string) =>
    pathname?.startsWith(makeTokensPathname(ns)) || false,
};

export const TokensModuleNav: ModuleNav = {
  makeModulePathnamePrefix: makeTokensPathname,
  includeNamespacePicker: true,
  routesRequireNamespace: TokensAppNavItem.routesRequireNamespace,
  translationNs: TOKENS_TRANSLATIONS_NS,
  translationKey: 'tokens',
  navItems: [
    {
      translationNs: TOKENS_TRANSLATIONS_NS,
      translationKey: 'dashboard',
      icon: ViewDashboardOutlineIcon,
      routesRequireNamespace: TokensAppNavItem.routesRequireNamespace,
      makePathname: makeTokensPathname,
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname === makeTokensPathname(ns),
    },
    {
      translationNs: TOKENS_TRANSLATIONS_NS,
      translationKey: 'tokenPools',
      icon: CircleDoubleIcon,
      routesRequireNamespace: TokensAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeTokensPathname(ns, '/tokenPools'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeTokensPathname(ns, '/tokenPools')) || false,
    },
    {
      translationNs: TOKENS_TRANSLATIONS_NS,
      translationKey: 'accounts',
      icon: AccountBalanceWalletOutlineIcon,
      routesRequireNamespace: TokensAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeTokensPathname(ns, '/accounts'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeTokensPathname(ns, '/accounts')) || false,
    },
    {
      translationNs: TOKENS_TRANSLATIONS_NS,
      translationKey: 'transfers',
      icon: SwapHorizontalIcon,
      routesRequireNamespace: TokensAppNavItem.routesRequireNamespace,
      makePathname: (ns?: string) => makeTokensPathname(ns, '/transfers'),
      isActiveCheck: (ns?: string, pathname?: string) =>
        pathname?.startsWith(makeTokensPathname(ns, '/transfers')) || false,
    },
  ],
};

// Routes
export const TOKENS_ROUTE_PREFIX = '/namespace/:namespace/tokens';
export const TokensRoutes: IRoute[] = [
  {
    exact: true,
    route: `${TOKENS_ROUTE_PREFIX}`,
    component: Dashboard,
  },
  {
    exact: true,
    route: `${TOKENS_ROUTE_PREFIX}/tokenPools`,
    component: TokenPools,
  },
  {
    exact: true,
    route: `${TOKENS_ROUTE_PREFIX}/tokenPools/:name`,
    component: TokenPoolDetails,
  },
  {
    exact: true,
    route: `${TOKENS_ROUTE_PREFIX}/accounts`,
    component: Accounts,
  },
  {
    exact: true,
    route: `${TOKENS_ROUTE_PREFIX}/transfers`,
    component: Transfers,
  },
];
