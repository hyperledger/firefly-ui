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
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ApplicationContext } from './contexts/ApplicationContext';
import { SnackbarContext } from './contexts/SnackbarContext';
import { Router } from './components/Router';
import { themeOptions } from './theme';
import { fetchWithCredentials, summarizeFetchError } from './utils';
import {
  MessageSnackbar,
  SnackbarMessageType,
} from './_core/components/MessageSnackbar';
import {
  CreatedFilterOptions,
  INamespace,
  DataView,
  IStatus,
} from './_core/interfaces';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { NAMESPACES_PATH } from './interfaces';

//TODO: remove along with useStyles() usage
declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
export const theme = createTheme(themeOptions);

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState<string | undefined>();
  const [namespaces, setNamespaces] = useState<INamespace[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState('');
  const [dataView, setDataView] = useState<DataView>('timeline');
  const ws = useRef<ReconnectingWebSocket | null>(null);
  const [identity, setIdentity] = useState('');
  const [lastEvent, setLastEvent] = useState<any>();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<SnackbarMessageType>('error');
  const [orgName, setOrgName] = useState('');
  const [createdFilter, setCreatedFilter] =
    useState<CreatedFilterOptions>('24hours');
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  const { pathname: currentPath } = useMemo(() => {
    return window.location;
  }, []);
  const splitPath = currentPath.split('/');
  const pathNamespaceIndex = splitPath.findIndex((p) => p === 'namespaces');
  const routerNamespace =
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
          setSelectedNamespace(status.defaults.namespace);
          const ns: INamespace[] = await namespaceResponse.json();
          setNamespaces(ns);

          //ensure valid namespace in route
          if (
            routerNamespace &&
            ns.find((option) => option.name === routerNamespace)
          ) {
            setSelectedNamespace(routerNamespace);
          } else {
            setSelectedNamespace(status.defaults.namespace);
            window.location.replace(
              `/${NAMESPACES_PATH}/${status.defaults.namespace}/home`
            );
          }
        } else {
          setInitError('true');
        }
      })
      .finally(() => {
        setInitialized(true);
      });
  }, [routerNamespace]);

  useEffect(() => {
    if (selectedNamespace) {
      ws.current = new ReconnectingWebSocket(
        `${protocol}://${window.location.hostname}:${window.location.port}/ws?namespace=${selectedNamespace}&ephemeral&autoack`
      );
      ws.current.onmessage = (event: any) => {
        setLastEvent(event);
      };

      return () => {
        if (ws.current) {
          ws.current.close();
        }
      };
    }
  }, [selectedNamespace]);

  const reportFetchError = (err: any) => {
    summarizeFetchError(err).then((message: string) => {
      setMessageType('error');
      setMessage(message);
    });
  };

  if (initialized) {
    if (initError) {
      // figure out what to display
      return <></>;
    } else {
      return (
        <ApplicationContext.Provider
          value={{
            namespaces,
            selectedNamespace,
            setSelectedNamespace,
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
            <StyledEngineProvider injectFirst>
              <ThemeProvider {...{ theme }}>
                <CssBaseline>
                  <Router />
                  <MessageSnackbar
                    {...{ message }}
                    {...{ setMessage }}
                    {...{ messageType }}
                  />
                </CssBaseline>
              </ThemeProvider>
            </StyledEngineProvider>
          </SnackbarContext.Provider>
        </ApplicationContext.Provider>
      );
    }
  } else {
    return <></>;
  }
};

export default App;
