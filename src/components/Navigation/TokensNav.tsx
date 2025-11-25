// Copyright © 2022 Kaleido, Inc.
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

import AdjustIcon from '@mui/icons-material/Adjust';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_NAV_PATHS, INavItem } from '../../interfaces';
import { NavSection } from './NavSection';

export const TokensNav = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);

  const blockchainPath = FF_NAV_PATHS.tokensPath(selectedNamespace);
  const transfersPath = FF_NAV_PATHS.tokensTransfersPath(selectedNamespace);
  const poolsPath = FF_NAV_PATHS.tokensPoolsPath(selectedNamespace);
  const balancesPath = FF_NAV_PATHS.tokensBalancesPath(selectedNamespace);
  const approvalsPath = FF_NAV_PATHS.tokensApprovalsPath(selectedNamespace);

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      to: blockchainPath,
      itemIsActive: pathname === blockchainPath,
    },
    {
      name: t('transfers'),
      to: transfersPath,
      itemIsActive: pathname === transfersPath,
    },
    {
      name: t('pools'),
      to: poolsPath,
      itemIsActive: pathname.startsWith(poolsPath),
    },
    {
      name: t('balances'),
      to: balancesPath,
      itemIsActive: pathname === balancesPath,
    },
    {
      name: t('approvals'),
      to: approvalsPath,
      itemIsActive: pathname === approvalsPath,
    },
  ];

  return (
    <NavSection icon={<AdjustIcon />} navItems={navItems} title={t('tokens')} />
  );
};
