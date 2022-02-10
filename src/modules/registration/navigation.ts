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

import { ModuleNav, NavItem } from '../../core/interfaces';
import { DataAppNavItem, DataModuleNav } from '../data/registration';
import { HomeAppNavItem } from '../home/registration';
import {
  MonitoringAppNavItem,
  MonitoringModuleNav,
} from '../monitoring/registration';
import {
  NetworkMapAppNavItem,
  NetworkMapModuleNav,
} from '../network-map/registration';
import { TokensAppNavItem, TokensModuleNav } from '../tokens/registration';

export const registerAppNavigationItems = (): NavItem[] => {
  return [
    HomeAppNavItem,
    NetworkMapAppNavItem,
    DataAppNavItem,
    TokensAppNavItem,
    MonitoringAppNavItem,
  ];
};

export const registerModuleNavigationItems = (): ModuleNav[] => {
  return [
    DataModuleNav,
    NetworkMapModuleNav,
    TokensModuleNav,
    MonitoringModuleNav,
  ];
};
