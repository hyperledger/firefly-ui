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

import ViewInArIcon from '@mui/icons-material/ViewInAr';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_NAV_PATHS, INavItem } from '../../interfaces';
import { NavSection } from './NavSection';

export const BlockchainNav = () => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();

  const blockchainPath = FF_NAV_PATHS.blockchainPath(selectedNamespace);
  const eventsPath = FF_NAV_PATHS.blockchainEventsPath(selectedNamespace);
  const apiPath = FF_NAV_PATHS.blockchainApisPath(selectedNamespace);
  const interfacesPath =
    FF_NAV_PATHS.blockchainInterfacesPath(selectedNamespace);
  const listenersPath = FF_NAV_PATHS.blockchainListenersPath(selectedNamespace);

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      to: blockchainPath,
      itemIsActive: pathname === blockchainPath,
    },
    {
      name: t('events'),
      to: eventsPath,
      itemIsActive: pathname === eventsPath,
    },
    {
      name: t('apis'),
      to: apiPath,
      itemIsActive: pathname === apiPath,
    },
    {
      name: t('interfaces'),
      to: interfacesPath,
      itemIsActive: pathname === interfacesPath,
    },
    {
      name: t('listeners'),
      to: listenersPath,
      itemIsActive: pathname === listenersPath,
    },
  ];

  return (
    <NavSection
      icon={<ViewInArIcon />}
      navItems={navItems}
      title={t('blockchain')}
    />
  );
};
