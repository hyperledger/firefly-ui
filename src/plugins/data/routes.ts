// Copyright © 2021 Kaleido, Inc.
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

import { Dashboard } from './views/Dashboard';
import { Data } from './views/Data/Data';
import { TransactionDetails } from './views/Transactions/TransactionDetails';
import { Messages } from './views/Messages/Messages';
import { IRoute } from '../../core/interfaces';
import { Transactions } from './views/Transactions/Transactions';

export const DataRoutes: IRoute[] = [
  {
    exact: true,
    path: '/namespace/:namespace/transactions/:id',
    component: TransactionDetails,
  },
  {
    exact: true,
    path: '/namespace/:namespace/transactions',
    component: Transactions,
  },
  {
    exact: true,
    path: '/namespace/:namespace/data',
    component: Data,
  },
  {
    exact: true,
    path: '/namespace/:namespace/messages',
    component: Messages,
  },
  {
    exact: true,
    path: '/namespace/:namespace',
    component: Dashboard,
  },
  {
    exact: true,
    path: '/network',
    component: Dashboard,
  },
  {
    exact: true,
    path: '/',
    component: Dashboard,
  },
];
