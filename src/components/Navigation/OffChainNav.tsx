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
  DATA_PATH,
  DATA_TYPES_PATH,
  FILE_EXPLORER_PATH,
  INavItem,
  NAMESPACES_PATH,
  OFFCHAIN_PATH,
} from '../../interfaces';
import { themeOptions } from '../../theme';
import { NavItem } from './NavItem';

export const OffChainNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const [offChainOpen, setOffChainOpen] = useState(false);
  const baseOffChainPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${OFFCHAIN_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(baseOffChainPath),
      itemIsActive: pathname === baseOffChainPath,
    },
    {
      name: t('data'),
      action: () => navigate(`${baseOffChainPath}/${DATA_PATH}`),
      itemIsActive: pathname === `${baseOffChainPath}/${DATA_PATH}`,
    },
    {
      name: t('fileExplorer'),
      action: () => navigate(`${baseOffChainPath}/${FILE_EXPLORER_PATH}`),
      itemIsActive: pathname === `${baseOffChainPath}/${FILE_EXPLORER_PATH}`,
    },
    {
      name: t('dataTypes'),
      action: () => navigate(`${baseOffChainPath}/${DATA_TYPES_PATH}`),
      itemIsActive: pathname === `${baseOffChainPath}/${DATA_TYPES_PATH}`,
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
        onClick={() => setOffChainOpen(!offChainOpen)}
      >
        <ListItemIcon>
          <InventoryIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography>{t('offChain')}</Typography>
        </ListItemText>
        {offChainOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={offChainOpen} unmountOnExit>
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
