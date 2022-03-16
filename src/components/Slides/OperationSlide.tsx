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
import { useParams } from 'react-router-dom';
import { IOperation } from '../../interfaces';
import { FF_OP_CATEGORY_MAP } from '../../interfaces/enums';
import { DEFAULT_PADDING } from '../../theme';
import { JsonViewAccordion } from '../Accordions/JsonViewerAccordion';
import { OperationList } from '../Lists/OperationList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  op: IOperation;
  open: boolean;
  onClose: () => void;
}

export const OperationSlide: React.FC<Props> = ({ op, open, onClose }) => {
  const { t } = useTranslation();
  const { txID } = useParams<{ txID: string }>();

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader
            subtitle={t('operation')}
            title={t(FF_OP_CATEGORY_MAP[op.type].nicename)}
          />
          {/* Data list */}
          <Grid container item pb={DEFAULT_PADDING}>
            <OperationList op={op} showTxLink={txID !== op.tx} />
          </Grid>
          {/* Input and Output */}
          {(op.input || op.output) && (
            <SlideSectionHeader title={t('inputAndOutput')} />
          )}
          {op.input && (
            <Grid container item pb={DEFAULT_PADDING}>
              <JsonViewAccordion
                header={t('input')}
                json={JSON.stringify(op.input, null, 2)}
              />
            </Grid>
          )}
          {op.output && (
            <Grid container item>
              <JsonViewAccordion
                header={t('output')}
                json={JSON.stringify(op.output, null, 2)}
              />
            </Grid>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
