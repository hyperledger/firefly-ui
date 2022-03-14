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
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import {
  ACCOUNTS_PATH,
  INavItem,
  NAMESPACES_PATH,
  POOLS_PATH,
  TOKENS_PATH,
  TRANSFERS_PATH,
} from '../../interfaces';
import { NavSection } from './NavSection';

export const TokensNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const basePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${TOKENS_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(basePath),
      itemIsActive: pathname === basePath,
    },
    {
      name: t('transfers'),
      action: () => navigate(`${basePath}/${TRANSFERS_PATH}`),
      itemIsActive: pathname === `${basePath}/${TRANSFERS_PATH}`,
    },
    {
      name: t('pools'),
      action: () => navigate(`${basePath}/${POOLS_PATH}`),
      itemIsActive: pathname === `${basePath}/${POOLS_PATH}`,
    },
    {
      name: t('accounts'),
      action: () => navigate(`${basePath}/${ACCOUNTS_PATH}`),
      itemIsActive: pathname === `${basePath}/${ACCOUNTS_PATH}`,
    },
  ];

  return (
    <NavSection icon={<AdjustIcon />} navItems={navItems} title={t('tokens')} />
  );
};
