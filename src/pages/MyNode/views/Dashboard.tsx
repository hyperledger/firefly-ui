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

import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MyNodeDiagram } from '../../../components/Charts/MyNodeDiagram';
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import { FF_Paths, IStatus } from '../../../interfaces';
import { fetchCatcher } from '../../../utils';

export const MyNodeDashboard: () => JSX.Element = () => {
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [plugins, setPlugins] = useState<IStatus['plugins']>();
  const [isLoading, setIsLoading] = useState(true);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (isMounted) {
      fetchCatcher(`${FF_Paths.apiPrefix}/${FF_Paths.status}`)
        .then((statusRes: IStatus) => {
          isMounted && setPlugins(statusRes.plugins);
        })
        .catch((err) => {
          reportFetchError(err);
        });
      setIsLoading(false);
    }
  }, [isMounted]);

  return (
    <>
      <Header
        title={t('dashboard')}
        subtitle={t('myNode')}
        noDateFilter
        noNsFilter
      ></Header>
      <FFPageLayout height="750px">
        {!isLoading &&
          plugins &&
          Object.keys(plugins ?? {}).length > 0 &&
          isMounted && <MyNodeDiagram plugins={plugins} />}
      </FFPageLayout>
    </>
  );
};
