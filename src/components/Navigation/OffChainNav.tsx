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

import InventoryIcon from '@mui/icons-material/Inventory';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import {
  DATA_PATH,
  DATA_TYPES_PATH,
  INavItem,
  MESSAGES_PATH,
  NAMESPACES_PATH,
  OFFCHAIN_PATH,
} from '../../interfaces';
import { NavSection } from './NavSection';

export const OffChainNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const basePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${OFFCHAIN_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(basePath),
      itemIsActive: pathname === basePath,
    },
    {
      name: t('messages'),
      action: () => navigate(`${basePath}/${MESSAGES_PATH}`),
      itemIsActive: pathname === `${basePath}/${MESSAGES_PATH}`,
    },
    {
      name: t('data'),
      action: () => navigate(`${basePath}/${DATA_PATH}`),
      itemIsActive: pathname === `${basePath}/${DATA_PATH}`,
    },
    {
      name: t('datatypes'),
      action: () => navigate(`${basePath}/${DATA_TYPES_PATH}`),
      itemIsActive: pathname === `${basePath}/${DATA_TYPES_PATH}`,
    },
  ];

  return (
    <NavSection
      icon={<InventoryIcon />}
      navItems={navItems}
      title={t('offChain')}
    />
  );
};
