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
import { FF_NAV_PATHS, INavItem } from '../../interfaces';
import { NavSection } from './NavSection';

export const ActivityNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();

  const timelinePath = FF_NAV_PATHS.activityTimelinePath(selectedNamespace);
  const eventsPath = FF_NAV_PATHS.activityEventsPath(selectedNamespace);
  const txPath = FF_NAV_PATHS.activityTxPath(selectedNamespace);
  const opsPath = FF_NAV_PATHS.activityOpPath(selectedNamespace);

  const navItems: INavItem[] = [
    {
      name: t('timeline'),
      action: () => navigate(timelinePath),
      itemIsActive: pathname === timelinePath,
    },
    {
      name: t('events'),
      action: () => navigate(eventsPath),
      itemIsActive: pathname === eventsPath,
    },
    {
      name: t('transactions'),
      action: () => navigate(txPath),
      itemIsActive: pathname === txPath,
    },
    {
      name: t('operations'),
      action: () => navigate(opsPath),
      itemIsActive: pathname === opsPath,
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
