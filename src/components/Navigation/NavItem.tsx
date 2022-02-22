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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { FFColors, themeOptions } from '../../theme';

interface Props {
  name: string;
  action: () => void;
  icon?: JSX.Element;
  itemIsActive: boolean;
}

export const NavItem = ({ name, action, icon, itemIsActive }: Props) => {
  return (
    <ListItemButton
      onClick={action}
      sx={{
        borderLeft: 6,
        borderLeftColor: itemIsActive
          ? FFColors.Yellow
          : themeOptions.palette?.background?.default,
        backgroundColor: itemIsActive
          ? 'background.paper'
          : themeOptions.palette?.background?.default,
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>
        <Typography>{name}</Typography>
      </ListItemText>
    </ListItemButton>
  );
};
