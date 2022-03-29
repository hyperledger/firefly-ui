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

import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import ExpandMore from 'mdi-react/ChevronDownIcon';
import ExpandLess from 'mdi-react/ChevronUpIcon';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { INavItem } from '../../interfaces';
import { NavItem } from './NavItem';

interface Props {
  icon: JSX.Element;
  navItems: INavItem[];
  title: string;
}

export const NavSection = ({ icon, navItems, title }: Props) => {
  const [open, setOpen] = useState(
    navItems.every((item) => item.itemIsActive === false) ? false : true
  );
  const { pathname } = useLocation();

  useEffect(() => {
    const isActive = navItems.every((item) => item.itemIsActive === false)
      ? false
      : true;
    isActive && setOpen(true);
  }, [pathname]);

  return (
    <>
      <ListItemButton
        sx={{
          borderLeft: 6,
          borderLeftColor: 'background.default',
          backgroundColor: 'background.default',
        }}
        onClick={() => setOpen(!open)}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>
          <Typography sx={{ fontSize: '16px' }}>{title}</Typography>
        </ListItemText>
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} unmountOnExit>
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
