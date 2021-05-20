import React, { useEffect, useState } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  createMuiTheme,
} from '@material-ui/core';
import { Dashboard } from './views/Dashboard';
import { Messages } from './views/Messages';
import { Transactions } from './views/Transactions';
import { Data } from './views/Data';
import { AppWrapper } from './components/AppWrapper';
import { NamespaceContext } from './contexts/NamespaceContext';
import { INamespace } from './interfaces';

const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});
const NAMESPACE_LOCALSTORAGE_KEY = 'ff:namespace';
export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#1E242A',
      paper: '#252C32',
    },
    text: {
      secondary: '#6E7780',
    },
    action: {
      active: '#1E242A',
    },
    tableRowAlternate: {
      main: '#21272D',
    },
  },
  overrides: {
    MuiListItem: {
      gutters: {
        paddingLeft: 25,
        paddingRight: 25,
      },
    },
  },
});

function App() {
  const [initializing, setInitializing] = useState(true);
  const [namespaces, setNamespaces] = useState<INamespace[]>([]);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('');

  useEffect(() => {
    fetch('/api/v1/namespaces')
      .then(async (response) => {
        if (response.ok) {
          const ns: INamespace[] = await response.json();
          setNamespaces(ns);
          const storageItem = window.localStorage.getItem(
            NAMESPACE_LOCALSTORAGE_KEY
          );
          if (storageItem) {
            setSelectedNamespace(storageItem);
          } else if (ns.length !== 0) {
            setSelectedNamespace(ns[0].name);
            window.localStorage.setItem(NAMESPACE_LOCALSTORAGE_KEY, ns[0].name);
          }
        }
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  if (initializing) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NamespaceContext.Provider
        value={{
          namespaces,
          selectedNamespace,
          setNamespaces,
          setSelectedNamespace,
        }}
      >
        <Router history={history}>
          <AppWrapper>
            <Switch>
              <Route exact path="/" render={() => <Dashboard />} />
              <Route exact path="/messages" render={() => <Messages />} />
              <Route exact path="/data" render={() => <Data />} />
              <Route
                exact
                path="/transactions"
                render={() => <Transactions />}
              />
            </Switch>
          </AppWrapper>
        </Router>
      </NamespaceContext.Provider>
    </ThemeProvider>
  );
}

export default App;
