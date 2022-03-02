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
  ACTIVITY_PATH,
  INavItem,
  MESSAGES_PATH,
  NAMESPACES_PATH,
} from '../../interfaces';
import { themeOptions } from '../../theme';
import { NavItem } from './NavItem';
import MessageIcon from '@mui/icons-material/Message';
export const MessagesNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const baseMessagesPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${MESSAGES_PATH}`;

  const navItems: INavItem[] = [
    {
      name: t('dashboard'),
      action: () => navigate(baseMessagesPath),
      itemIsActive: pathname === baseMessagesPath,
    },
    {
      name: t('activity'),
      action: () => navigate(`${baseMessagesPath}/${ACTIVITY_PATH}`),
      itemIsActive: pathname === `${baseMessagesPath}/${ACTIVITY_PATH}`,
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
        onClick={() => setMessagesOpen(!messagesOpen)}
      >
        <ListItemIcon>
          <MessageIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography>{t('messages')}</Typography>
        </ListItemText>
        {messagesOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={messagesOpen} unmountOnExit>
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
