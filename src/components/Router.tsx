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
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { AppWrapper } from './AppWrapper';
import { FFRouteObject } from '../interfaces';
import { HomeRoutes } from '../pages/Home/Routes';
import { ActivityRoutes } from '../pages/Activity/Routes';

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

export function getAllRoutes(): FFRouteObject[] {
  return [HomeRoutes, ActivityRoutes];
}
