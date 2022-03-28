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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ISubscription } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { JsonViewAccordion } from '../Accordions/JsonViewerAccordion';
import { SubList } from '../Lists/SubList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';

interface Props {
  sub: ISubscription;
  open: boolean;
  onClose: () => void;
}

export const SubscriptionSlide: React.FC<Props> = ({ sub, open, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader subtitle={t('subscription')} title={sub.name} />
          {/* Data list */}
          <Grid container item pb={DEFAULT_PADDING}>
            <SubList sub={sub} />
          </Grid>

          {sub.filter && (
            <Grid container item pb={DEFAULT_PADDING}>
              <JsonViewAccordion
                isOpen
                header={t('filter')}
                json={sub.filter}
              />
            </Grid>
          )}
          {sub.options && (
            <Grid container item>
              <JsonViewAccordion
                isOpen
                header={t('options')}
                json={sub.options}
              />
            </Grid>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
