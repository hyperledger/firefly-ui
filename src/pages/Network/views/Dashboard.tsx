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

import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../../components/Header';
import { NetworkMap } from '../../../components/NetworkMap/NetworkMap';
import { DEFAULT_PADDING } from '../../../theme';

export const NetworkMapDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <>
      <Header
        title={t('networkMap')}
        subtitle={t('network')}
        noDateFilter
        noNsFilter
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          alignItems="center"
          height="85vh"
        >
          {isMounted && <NetworkMap />}
        </Grid>
      </Grid>
    </>
  );
};
