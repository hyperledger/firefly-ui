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
import { FF_NAV_PATHS, INavItem } from '../../interfaces';
import { NavSection } from './NavSection';

export const OffChainNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);

  const offchainPath = FF_NAV_PATHS.offchainPath(selectedNamespace);
  const messagesPath = FF_NAV_PATHS.offchainMessagesPath(selectedNamespace);
  const dataPath = FF_NAV_PATHS.offchainDataPath(selectedNamespace);
  const groupsPath = FF_NAV_PATHS.offchainGroupsPath(selectedNamespace);
  const datatypesPath = FF_NAV_PATHS.offchainDatatypesPath(selectedNamespace);

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(offchainPath),
      itemIsActive: pathname === offchainPath,
    },
    {
      name: t('messages'),
      action: () => navigate(messagesPath),
      itemIsActive: pathname === messagesPath,
    },
    {
      name: t('data'),
      action: () => navigate(dataPath),
      itemIsActive: pathname === dataPath,
    },
    {
      name: t('groups'),
      action: () => navigate(groupsPath),
      itemIsActive: pathname === groupsPath,
    },
    {
      name: t('datatypes'),
      action: () => navigate(datatypesPath),
      itemIsActive: pathname === datatypesPath,
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
