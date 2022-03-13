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

import LanguageIcon from '@mui/icons-material/Language';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import {
  INavItem,
  NAMESPACES_PATH,
  NETWORK_PATH,
  NODES_PATH,
  ORGANIZATIONS_PATH,
} from '../../interfaces';
import { NavSection } from './NavSection';

export const NetworkNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();
  const basePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${NETWORK_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(basePath),
      itemIsActive: pathname === basePath,
    },
    {
      name: t('organizations'),
      action: () => navigate(`${basePath}/${ORGANIZATIONS_PATH}`),
      itemIsActive: pathname === `${basePath}/${ORGANIZATIONS_PATH}`,
    },
    {
      name: t('nodes'),
      action: () => navigate(`${basePath}/${NODES_PATH}`),
      itemIsActive: pathname === `${basePath}/${NODES_PATH}`,
    },
  ];

  return (
    <NavSection
      icon={<LanguageIcon />}
      navItems={navItems}
      title={t('network')}
    />
  );
};
