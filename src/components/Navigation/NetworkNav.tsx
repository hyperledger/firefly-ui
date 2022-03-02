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
  INavItem,
  NAMESPACES_PATH,
  NETWORK_PATH,
  NODES_PATH,
  ORGANIZATIONS_PATH,
} from '../../interfaces';
import { themeOptions } from '../../theme';
import { NavItem } from './NavItem';

export const NetworkNav = () => {
  const { t } = useTranslation();
  const [networkOpen, setNetworkOpen] = useState(false);
  const navigate = useNavigate();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();
  const baseNetworkPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${NETWORK_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(baseNetworkPath),
      itemIsActive: pathname === baseNetworkPath,
    },
    {
      name: t('organizations'),
      action: () => navigate(`${baseNetworkPath}/${ORGANIZATIONS_PATH}`),
      itemIsActive: pathname === `${baseNetworkPath}/${ORGANIZATIONS_PATH}`,
    },
    {
      name: t('nodes'),
      action: () => navigate(`${baseNetworkPath}/${NODES_PATH}`),
      itemIsActive: pathname === `${baseNetworkPath}/${NODES_PATH}`,
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
        onClick={() => setNetworkOpen(!networkOpen)}
      >
        <ListItemIcon>{<LanguageIcon />}</ListItemIcon>
        <ListItemText>
          <Typography>{t('network')}</Typography>
        </ListItemText>
        {networkOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={networkOpen} unmountOnExit>
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
