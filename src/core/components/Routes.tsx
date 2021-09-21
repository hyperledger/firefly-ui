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

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { QueryParamProvider } from 'use-query-params';
import ReconnectingWebsocket from 'reconnecting-websocket';
import {
  INamespace,
  CreatedFilterOptions,
  DataView,
  IStatus,
  IRoute,
} from '../interfaces';
import { Dashboard } from '../views/Dashboard';
import { Data } from '../views/Data/Data';
import { Transactions } from '../views/Transactions/Transactions';
import { TransactionDetails } from '../views/Transactions/TransactionDetails';
import { Messages } from '../views/Messages/Messages';
import { NamespaceContext } from '../contexts/NamespaceContext';
import { ApplicationContext } from '../contexts/ApplicationContext';
import { NavWrapper } from './NavWrapper';
import { fetchWithCredentials } from '../utils';
import { CircularProgress } from '@material-ui/core';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { MessageSnackbar, SnackbarMessageType } from './MessageSnackbar';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});

export const Routes: () => JSX.Element = () => {
  const [initializing, setInitializing] = useState(true);
  const [namespaces, setNamespaces] = useState<INamespace[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');
  const [dataView, setDataView] = useState<DataView>('timeline');
  const [identity, setIdentity] = useState('');
  const [orgName, setOrgName] = useState('');
  const [createdFilter, setCreatedFilter] =
    useState<CreatedFilterOptions>('24hours');
  const ws = useRef<ReconnectingWebSocket | null>(null);
  const [lastEvent, setLastEvent] = useState<any>();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<SnackbarMessageType>('error');

  //path needs to update on every render for conditional rendering since its outside of Router
  const { pathname: currentPath } = useMemo(() => {
    return window.location;
  }, []);

  const pathNamespace = currentPath.split('/')[2];

  useEffect(() => {
    Promise.all([
      fetchWithCredentials('/api/v1/namespaces'),
      fetchWithCredentials('/api/v1/status'),
    ])
      .then(async ([namespaceResponse, statusResponse]) => {
        if (namespaceResponse.ok && statusResponse.ok) {
          const status: IStatus = await statusResponse.json();
          setIdentity(status.org.identity);
          setOrgName(status.org.name);
          const namespaces: INamespace[] = await namespaceResponse.json();
          setNamespaces(namespaces);
          // ensure valid namespace is in route
          if (
            pathNamespace &&
            namespaces.find((option) => option.name === pathNamespace)
          ) {
            setSelectedNamespace(pathNamespace);
          } else {
            history.push(`/namespace/${status.defaults.namespace}`);
            setSelectedNamespace(status.defaults.namespace);
          }
        }
      })
      .finally(() => {
        setInitializing(false);
      });
  }, [pathNamespace]);

  useEffect(() => {
    if (selectedNamespace) {
      ws.current = new ReconnectingWebsocket(
        `${protocol}://${window.location.hostname}:${window.location.port}/ws?namespace=${selectedNamespace}&ephemeral&autoack`
      );
      ws.current.onmessage = (event: any) => {
        setLastEvent(event);
      };
    }
  }, [selectedNamespace]);

  if (initializing) {
    return <CircularProgress />;
  }

  const routes: IRoute[] = [
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

  return (
    <NamespaceContext.Provider
      value={{
        namespaces,
        selectedNamespace,
        setNamespaces,
        setSelectedNamespace,
      }}
    >
      <ApplicationContext.Provider
        value={{
          orgName,
          identity,
          dataView,
          setDataView,
          lastEvent,
          setLastEvent,
          createdFilter,
          setCreatedFilter,
        }}
      >
        <SnackbarContext.Provider value={{ setMessage, setMessageType }}>
          <MessageSnackbar
            {...{ message }}
            {...{ setMessage }}
            {...{ messageType }}
          />
          <QueryClientProvider client={queryClient}>
            <Router history={history}>
              <QueryParamProvider ReactRouterRoute={Route}>
                <Switch>
                  {routes.map((route, i) => (
                    <Route
                      key={i}
                      exact={route.exact}
                      path={route.path}
                      render={() => (
                        // navigation need to be within the route for access to url params
                        <NavWrapper>
                          <route.component />
                        </NavWrapper>
                      )}
                    />
                  ))}
                  <Redirect to="/" />
                </Switch>
              </QueryParamProvider>
            </Router>
          </QueryClientProvider>
        </SnackbarContext.Provider>
      </ApplicationContext.Provider>
    </NamespaceContext.Provider>
  );
};
