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

import { ThemeProvider, CssBaseline, createMuiTheme } from '@material-ui/core';
import { Routes } from './components/Routes';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#1E242A',
      paper: '#252C32',
    },
    text: {
      secondary: '#9BA7B0',
    },
    action: {
      active: '#1E242A',
    },
    tableRowAlternate: {
      main: '#21272D',
    },
    timelineBackground: {
      main: '#2D353C',
    },
  },
  overrides: {
    MuiListItem: {
      gutters: {
        paddingLeft: 25,
        paddingRight: 25,
      },
    },
    MuiSelect: {
      root: {
        color: '#6E7780',
      },
      select: {
        '&:focus': {
          backgroundColor: '#1E242A',
        },
      },
      icon: {
        color: '#6E7780',
      },
    },
    MuiOutlinedInput: {
      root: {
        '&:hover $notchedOutline': {
          borderColor: '#9BA7B0',
        },
        '&$focused $notchedOutline': {
          borderColor: '#9BA7B0',
        },
      },
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          backgroundColor: '#1E242A',
          color: '#6E7780',
        },
      },
    },
  },
});

function App(): JSX.Element {
  return (
    <ThemeProvider {...{ theme }}>
      <CssBaseline />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
