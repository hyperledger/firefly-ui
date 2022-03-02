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
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import ExpandMore from 'mdi-react/ChevronDownIcon';
import ExpandLess from 'mdi-react/ChevronUpIcon';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import {
  APIS_PATH,
  BLOCKCHAIN_PATH,
  EVENTS_PATH,
  INavItem,
  INTERFACES_PATH,
  NAMESPACES_PATH,
  SUBSCRIPTIONS_PATH,
} from '../../interfaces';
import { themeOptions } from '../../theme';
import { NavItem } from './NavItem';

export const BlockchainNav = () => {
  const { t } = useTranslation();
  const [blockchainOpen, setBlockchainOpen] = useState(false);
  const navigate = useNavigate();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();
  const baseBlockchainPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${BLOCKCHAIN_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(baseBlockchainPath),
      itemIsActive: pathname === baseBlockchainPath,
    },
    {
      name: t('events'),
      action: () => navigate(`${baseBlockchainPath}/${EVENTS_PATH}`),
      itemIsActive: pathname === `${baseBlockchainPath}/${EVENTS_PATH}`,
    },
    {
      name: t('interfaces'),
      action: () => navigate(`${baseBlockchainPath}/${INTERFACES_PATH}`),
      itemIsActive: pathname === `${baseBlockchainPath}/${INTERFACES_PATH}`,
    },
    {
      name: t('apis'),
      action: () => navigate(`${baseBlockchainPath}/${APIS_PATH}`),
      itemIsActive: pathname === `${baseBlockchainPath}/${APIS_PATH}`,
    },
    {
      name: t('subscriptions'),
      action: () => navigate(`${baseBlockchainPath}/${SUBSCRIPTIONS_PATH}`),
      itemIsActive: pathname === `${baseBlockchainPath}/${SUBSCRIPTIONS_PATH}`,
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
        onClick={() => setBlockchainOpen(!blockchainOpen)}
      >
        <ListItemIcon>{<ViewInArIcon />}</ListItemIcon>
        <ListItemText>
          <Typography>{t('blockchain')}</Typography>
        </ListItemText>
        {blockchainOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={blockchainOpen} unmountOnExit>
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
