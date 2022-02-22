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

import React, { useContext, useState } from 'react';
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandLess from 'mdi-react/ChevronUpIcon';
import ExpandMore from 'mdi-react/ChevronDownIcon';
import ChartBoxOutline from 'mdi-react/ChartBoxOutlineIcon';
import { NavItem } from './NavItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { INavItem, NAMESPACES_PATH } from '../../interfaces';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import {
  ACTIVITY_PATH,
  EVENTS_PATH,
  OPERATIONS_PATH,
  TRANSACTIONS_PATH,
} from '../../interfaces';
import { themeOptions } from '../../theme';

export const ActivityNav = () => {
  const { t } = useTranslation();
  const [activityOpen, setActivityOpen] = useState(false);
  const navigate = useNavigate();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();
  const baseActivityPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${ACTIVITY_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(baseActivityPath),
      itemIsActive: pathname === baseActivityPath,
    },
    {
      name: t('events'),
      action: () => navigate(`${baseActivityPath}/${EVENTS_PATH}`),
      itemIsActive: pathname === `${baseActivityPath}/${EVENTS_PATH}`,
    },
    {
      name: t('transactions'),
      action: () => navigate(`${baseActivityPath}/${TRANSACTIONS_PATH}`),
      itemIsActive: pathname === `${baseActivityPath}/${TRANSACTIONS_PATH}`,
    },
    {
      name: t('operations'),
      action: () => navigate(`${baseActivityPath}/${OPERATIONS_PATH}`),
      itemIsActive: pathname === `${baseActivityPath}/${OPERATIONS_PATH}`,
    },
  ];

  return (
    <>
      <ListItemButton
        sx={{
          borderLeft: 6,
          borderLeftColor: themeOptions.palette?.background?.default,
          backgroundColor: themeOptions.palette?.background?.default,
        }}
        onClick={() => setActivityOpen(!activityOpen)}
      >
        <ListItemIcon>{<ChartBoxOutline />}</ListItemIcon>
        <ListItemText>
          <Typography>{t('activity')}</Typography>
        </ListItemText>
        {activityOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={activityOpen} unmountOnExit>
        {navItems.map((item) => (
          <NavItem
            name={item.name}
            action={item.action}
            itemIsActive={item.itemIsActive}
            key={item.name}
          />
        ))}
      </Collapse>
    </>
  );
};
