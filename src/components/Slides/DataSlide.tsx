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
import { IData } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { JsonViewAccordion } from '../Accordions/JsonViewerAccordion';
import { DataList } from '../Lists/DataList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  data: IData;
  open: boolean;
  onClose: () => void;
}

export const DataSlide: React.FC<Props> = ({ data, open, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader title={t('data')} />
          {/* Data list */}
          <Grid container item pb={DEFAULT_PADDING}>
            <DataList data={data} />
          </Grid>
          {/* Value */}
          {data.value && <SlideSectionHeader title={t('dataValue')} />}
          {data.value && (
            <Grid container item pb={DEFAULT_PADDING}>
              <JsonViewAccordion header={t('value')} json={data.value} />
            </Grid>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
