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

import React, { useState } from 'react';
import { Navigation } from './Navigation/Navigation';
import { makeStyles } from '@material-ui/core';
import { HiddenAppBar } from './HiddenAppBar';

export const NavWrapper: React.FC = ({ children }) => {
  const classes = useStyles();
  const [navigationOpen, setNavigationOpen] = useState(true);

  return (
    <div className={classes.root}>
      <Navigation
        navigationOpen={navigationOpen}
        setNavigationOpen={setNavigationOpen}
      />
      <main className={classes.content}>
        <HiddenAppBar
          navigationOpen={navigationOpen}
          setNavigationOpen={setNavigationOpen}
        />
        {children}
      </main>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
  },
}));
