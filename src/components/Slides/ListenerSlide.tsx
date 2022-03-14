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
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IContractListener } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { ListenerEventParamAccordion } from '../Accordions/ListenerEventParam';
import { FFCopyButton } from '../Buttons/CopyButton';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  listener: IContractListener;
  open: boolean;
  onClose: () => void;
}

export const ListenerSlide: React.FC<Props> = ({ listener, open, onClose }) => {
  const { t } = useTranslation();

  const dataList: IDataListItem[] = [
    {
      label: t('id'),
      value: listener.id,
      button: <FFCopyButton value={listener.id} />,
    },
    {
      label: t('interfaceID'),
      value: listener.interface.id,
      button: <FFCopyButton value={listener.interface.id} />,
    },
    {
      label: t('protocolID'),
      value: listener.protocolId,
      button: <FFCopyButton value={listener.protocolId} />,
    },
    {
      label: t('address'),
      value: listener.location.address,
      button: <FFCopyButton value={listener.location.address} />,
    },
    {
      label: t('description'),
      value: listener.event.description?.length
        ? listener.event.description
        : t('noDescriptionForListener').toString(),
    },
    {
      label: t('created'),
      value: dayjs(listener.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Title */}
          <SlideHeader
            subtitle={t('contractListener')}
            title={listener.event.name}
          />
          {/* Data list */}
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Event Params */}
          <SlideSectionHeader title={t('eventParams')} />
          <Grid container item>
            {listener.event.params?.map((param) => (
              <ListenerEventParamAccordion param={param} />
            ))}
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};
