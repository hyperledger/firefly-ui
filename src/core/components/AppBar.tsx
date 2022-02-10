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
  AppBar as MaterialAppBar,
  Box,
  CssBaseline,
  Toolbar,
} from '@mui/material';
import React from 'react';
import { MenuLogo } from './MenuLogo';

type Props = {
  navigationOpen: boolean;
  setNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppBar: React.FC<Props> = ({
  navigationOpen,
  setNavigationOpen,
}) => {
  return (
    <Box display="flex">
      <CssBaseline />
      <MaterialAppBar position="fixed">
        <Toolbar>
          <MenuLogo
            navigationOpen={navigationOpen}
            setNavigationOpen={setNavigationOpen}
          />
        </Toolbar>
      </MaterialAppBar>
    </Box>
  );
};
