import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core';
import { Dashboard } from './views/Dashboard';
import { Messages } from './views/Messages';
import { AppWrapper } from './components/AppWrapper';

const history = createBrowserHistory();
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router history={history}>
        <AppWrapper>
          <Switch>
            <Route exact path="/" render={() => <Dashboard />} />
            <Route exact path="/messages" render={() => <Messages />} />
          </Switch>
        </AppWrapper>
      </Router>
    </ThemeProvider>
  );
}

export default App;
