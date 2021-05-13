import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core';
import { Dashboard } from './views/Dashboard';
import { AppWrapper } from './components/AppWrapper';

const history = createBrowserHistory();
export const theme = createMuiTheme({
  palette: {
    type: 'dark',
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
          </Switch>
        </AppWrapper>
      </Router>
    </ThemeProvider>
  );
}

export default App;
