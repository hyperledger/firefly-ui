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
import {
  FF_NAV_PATHS,
  IContractInterface,
  IContractListener,
  IFireflyApi,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { ApiAccordion } from '../Accordions/ApiAccordion';
import { ListenerAccordion } from '../Accordions/ListenerAccordion';
import { InterfaceList } from '../Lists/InterfaceList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  cInterface: IContractInterface;
  open: boolean;
  onClose: () => void;
}

export const InterfaceSlide: React.FC<Props> = ({
  cInterface,
  open,
  onClose,
}) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);

  // Interface API
  const [interfaceApis, setInterfaceApis] = useState<IFireflyApi[]>([]);
  // Interface Listeners
  const [interfaceListeners, setInterfaceListeners] = useState<
    IContractListener[]
  >([]);

  useEffect(() => {
    // Interface API, if exists
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.apis}?interface=${cInterface?.id}&limit=5`
    )
      .then((apis: IFireflyApi[]) => {
        setInterfaceApis(apis);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Interface Listeners
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.contractListeners}?interface=${cInterface?.id}&limit=5`
    )
      .then((listeners: IContractListener[]) => {
        setInterfaceListeners(listeners);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [cInterface]);

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Title */}
          <SlideHeader
            subtitle={t('contractInterface')}
            title={cInterface?.name}
          />
          {/* Data list */}
          <Grid container item>
            <InterfaceList cInterface={cInterface} />
          </Grid>
          {/* APIs */}
          {interfaceApis?.length > 0 && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.blockchainApisPath(
                  selectedNamespace,
                  cInterface.id
                )}
                title={t('apis')}
              />
              <Grid container item>
                {interfaceApis?.map((api, idx) => (
                  <ApiAccordion key={idx} api={api} />
                ))}
              </Grid>
            </>
          )}
          {/* Listeners */}
          {interfaceListeners?.length > 0 && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.blockchainListenersPath(
                  selectedNamespace,
                  cInterface.id
                )}
                title={t('listeners')}
              />
              <Grid container item>
                {interfaceListeners?.map((listener) => (
                  <ListenerAccordion key={listener.id} listener={listener} />
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
