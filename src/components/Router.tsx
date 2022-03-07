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

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, RouteObject, useRoutes } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ActivityRoutes } from '../pages/Activity/Routes';
import { BlockchainRoutes } from '../pages/Blockchain/Routes';
import { HomeRoutes } from '../pages/Home/Routes';
import { MessagesRoutes } from '../pages/Messages/Routes';
import { MyNodeRoutes } from '../pages/MyNode/Routes';
import { NetworkRoutes } from '../pages/Network/Routes';
import { OffChainRoutes } from '../pages/Off-Chain/Routes';
import { TokensRoutes } from '../pages/Tokens/Routes';
import { AppWrapper } from './AppWrapper';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Router: () => JSX.Element = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryParamProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </QueryParamProvider>
    </QueryClientProvider>
  );
};

export default function Routes() {
  const routes = useRoutes([
    {
      path: '/',
      element: <AppWrapper />,
      children: getAllRoutes(),
    },
  ]);
  return routes;
}

export function getAllRoutes(): RouteObject[] {
  return [
    HomeRoutes,
    ActivityRoutes,
    BlockchainRoutes,
    OffChainRoutes,
    MessagesRoutes,
    TokensRoutes,
    NetworkRoutes,
    MyNodeRoutes,
  ];
}
