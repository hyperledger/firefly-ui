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
import { IGroup } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { getShortHash } from '../../utils';
import { GroupList } from '../Lists/GroupList';
import { MemberStack } from '../Stacks/MemberStack';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  group: IGroup;
  open: boolean;
  onClose: () => void;
}

export const GroupSlide: React.FC<Props> = ({ group, open, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader
            subtitle={t('group')}
            title={group.name.length ? group.name : getShortHash(group.hash)}
          />
          {/* Group list */}
          <Grid container item pb={DEFAULT_PADDING}>
            <GroupList group={group} />
          </Grid>
          {/* Members */}
          <Grid container item>
            <SlideSectionHeader title={t('groupMembers')} />
            {group.members.map((m, idx) => (
              <MemberStack key={idx} member={m} />
            ))}
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};
