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

import React, { useContext, useEffect } from 'react';
import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import { DataView } from '../interfaces';
import { useTranslation } from 'react-i18next';
import { useQueryParam, StringParam } from 'use-query-params';
import { ApplicationContext } from '../contexts/ApplicationContext';

export const DataViewSwitch: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { dataView, setDataView } = useContext(ApplicationContext);
  const [view, setView] = useQueryParam('view', StringParam);

  useEffect(() => {
    // set view if it's present in the url
    if (view) {
      setDataView(view as DataView);
      return;
    }

    // use view from state and update the url
    setView(dataView);
  }, [view, setView, setDataView, dataView]);

  return (
    <>
      <ButtonGroup className={classes.buttonGroup}>
        <Button
          onClick={() => setView('timeline')}
          className={
            dataView === 'timeline' ? classes.buttonSelected : classes.button
          }
        >
          {t('timeline')}
        </Button>
        <Button
          onClick={() => setView('list')}
          className={
            dataView === 'list' ? classes.buttonSelected : classes.button
          }
        >
          {t('list')}
        </Button>
      </ButtonGroup>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonSelected: {
    backgroundColor: theme.palette.action.selected,
    borderBottom: '2px solid white',
  },
  button: {
    color: theme.palette.text.disabled,
  },
  buttonGroup: {
    height: 40,
  },
}));
