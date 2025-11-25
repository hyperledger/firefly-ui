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
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  name: string;
  itemIsActive: boolean;
  icon?: JSX.Element;
  rightIcon?: JSX.Element;
  isRoot?: boolean;

  // NEW:
  to?: string; // internal route (React Router)
  href?: string; // external link
  action?: () => void; // fallback click handler (legacy)
}
export const NavItem = ({
  name,
  action,
  icon,
  itemIsActive,
  rightIcon,
  isRoot = false,
  to,
  href,
}: Props) => {
  const linkProps =
    to != null
      ? { component: RouterLink, to }
      : href != null
      ? {
          component: 'a' as const,
          href,
          target: '_blank',
          rel: 'noopener noreferrer',
        }
      : {};
  return (
    <ListItemButton
      {...linkProps}
      onClick={action}
      sx={{
        borderLeft: 6,
        borderLeftColor: itemIsActive ? 'warning.main' : 'background.default',
        backgroundColor: itemIsActive
          ? 'background.paper'
          : 'background.default',
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>
        {rightIcon ? (
          <Grid container direction="row">
            <Grid container item justifyContent="flex-start" xs={6}>
              <Typography sx={{ fontSize: isRoot ? '16px' : '14px' }}>
                {name}
              </Typography>
            </Grid>
            <Grid
              container
              item
              justifyContent="flex-end"
              xs={6}
              sx={{ color: 'text.secondary' }}
            >
              {rightIcon}
            </Grid>
          </Grid>
        ) : (
          <Typography sx={{ fontSize: isRoot ? '16px' : '14px' }}>
            {name}
          </Typography>
        )}
      </ListItemText>
    </ListItemButton>
  );
};
