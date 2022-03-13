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

import ChartBoxOutline from 'mdi-react/ChartBoxOutlineIcon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import {
  ACTIVITY_PATH,
  EVENTS_PATH,
  INavItem,
  NAMESPACES_PATH,
  OPERATIONS_PATH,
  TRANSACTIONS_PATH,
} from '../../interfaces';
import { NavSection } from './NavSection';

export const ActivityNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();
  const basePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${ACTIVITY_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('timeline'),
      action: () => navigate(basePath),
      itemIsActive: pathname === basePath,
    },
    {
      name: t('events'),
      action: () => navigate(`${basePath}/${EVENTS_PATH}`),
      itemIsActive: pathname === `${basePath}/${EVENTS_PATH}`,
    },
    {
      name: t('transactions'),
      action: () => navigate(`${basePath}/${TRANSACTIONS_PATH}`),
      itemIsActive: pathname === `${basePath}/${TRANSACTIONS_PATH}`,
    },
    {
      name: t('operations'),
      action: () => navigate(`${basePath}/${OPERATIONS_PATH}`),
      itemIsActive: pathname === `${basePath}/${OPERATIONS_PATH}`,
    },
  ];

  return (
    <NavSection
      icon={<ChartBoxOutline />}
      navItems={navItems}
      title={t('activity')}
    />
  );
};
