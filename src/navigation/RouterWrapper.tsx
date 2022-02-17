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

import { CircularProgress } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import {
  default as ReconnectingWebSocket,
  default as ReconnectingWebsocket,
} from 'reconnecting-websocket';
import { QueryParamProvider } from 'use-query-params';
import { fetchWithCredentials, summarizeFetchError } from '../components/utils';
import {
  MessageSnackbar,
  SnackbarMessageType,
} from '../core/components/MessageSnackbar';
import { ApplicationContext } from '../core/contexts/ApplicationContext';
import { NamespaceContext } from '../core/contexts/NamespaceContext';
import { SnackbarContext } from '../core/contexts/SnackbarContext';
import {
  CreatedFilterOptions,
  DataView,
  INamespace,
  IStatus,
} from '../core/interfaces';
import { ActivityRoutes } from '../pages/Activity/routes';
import { HomeRoutes } from '../pages/Home/routes';
import { Layout } from './Layout';
import { FFRouteObject } from './NavigationInterfaces';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

export const RouterWrapper: () => JSX.Element = () => {
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

  const splitPath = currentPath.split('/');
  const pathNamespaceIndex = splitPath.findIndex((p) => p === 'namespace');
  const pathNamespace =
    splitPath.length >= pathNamespaceIndex + 1
      ? splitPath[pathNamespaceIndex + 1]
      : '';
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

  const reportFetchError = (err: any) => {
    summarizeFetchError(err).then((message: string) => {
      setMessageType('error');
      setMessage(message);
    });
  };

  if (initializing) {
    return <CircularProgress />;
  }

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
        <SnackbarContext.Provider
          value={{ setMessage, setMessageType, reportFetchError }}
        >
          <MessageSnackbar
            {...{ message }}
            {...{ setMessage }}
            {...{ messageType }}
          />
          <QueryClientProvider client={queryClient}>
            <QueryParamProvider>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </QueryParamProvider>
          </QueryClientProvider>
        </SnackbarContext.Provider>
      </ApplicationContext.Provider>
    </NamespaceContext.Provider>
  );
};

export default function Router() {
  const element = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: getAllRoutes(),
    },
  ]);
  return element;
}

export function getAllRoutes(): FFRouteObject[] {
  return [
    HomeRoutes,
    ActivityRoutes,
    // ...Test
  ];
}
