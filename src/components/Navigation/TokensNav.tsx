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

import AdjustIcon from '@mui/icons-material/Adjust';
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
  ACCOUNTS_PATH,
  INavItem,
  NAMESPACES_PATH,
  POOLS_PATH,
  TOKENS_PATH,
  TRANSFERS_PATH,
} from '../../interfaces';
import { themeOptions } from '../../theme';
import { NavItem } from './NavItem';

export const TokensNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const [tokensOpen, setTokensOpen] = useState(false);
  const baseTokensPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${TOKENS_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(baseTokensPath),
      itemIsActive: pathname === baseTokensPath,
    },
    {
      name: t('transfers'),
      action: () => navigate(`${baseTokensPath}/${TRANSFERS_PATH}`),
      itemIsActive: pathname === `${baseTokensPath}/${TRANSFERS_PATH}`,
    },
    {
      name: t('pools'),
      action: () => navigate(`${baseTokensPath}/${POOLS_PATH}`),
      itemIsActive: pathname === `${baseTokensPath}/${POOLS_PATH}`,
    },
    {
      name: t('accounts'),
      action: () => navigate(`${baseTokensPath}/${ACCOUNTS_PATH}`),
      itemIsActive: pathname === `${baseTokensPath}/${ACCOUNTS_PATH}`,
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
        onClick={() => setTokensOpen(!tokensOpen)}
      >
        <ListItemIcon>
          <AdjustIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography>{t('tokens')}</Typography>
        </ListItemText>
        {tokensOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={tokensOpen} unmountOnExit>
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
