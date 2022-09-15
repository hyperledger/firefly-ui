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
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { FF_Paths, IIdentity } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { IdentityList } from '../Lists/IdentityList';
import { VerifiersList } from '../Lists/VerifiersList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  did: string;
  open: boolean;
  onClose: () => void;
}

export const IdentitySlide: React.FC<Props> = ({ did, open, onClose }) => {
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [identity, setIdentity] = useState<IIdentity>();
  const { selectedNamespace } = useContext(ApplicationContext);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    isMounted &&
      fetchCatcher(
        `${
          FF_Paths.nsPrefix
        }/${selectedNamespace}/${FF_Paths.networkIdentitiesByDID(
          did
        )}?fetchverifiers`
      )
        .then((identity: IIdentity) => {
          isMounted && setIdentity(identity);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [isMounted]);

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader subtitle={t('identity')} title={identity?.name ?? ''} />
          {/* Group list */}
          <Grid container item pb={1}>
            <IdentityList identity={identity} />
          </Grid>
          {/* Verifiers */}
          <Grid container item pb={DEFAULT_PADDING}>
            <SlideSectionHeader title={t('verifiers')} />
            <VerifiersList verifiers={identity?.verifiers} />
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};
