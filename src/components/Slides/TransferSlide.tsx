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

import { Chip, Grid } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  FF_NAV_PATHS,
  IBlockchainEvent,
  IOperation,
  ITokenTransfer,
  ITxStatus,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import {
  FF_TRANSFER_CATEGORY_MAP,
  TxStatusColorMap,
} from '../../interfaces/enums';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { BlockchainEventAccordion } from '../Accordions/BlockchainEvent';
import { OperationAccordion } from '../Accordions/Operation';
import { FFCopyButton } from '../Buttons/CopyButton';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  transfer: ITokenTransfer;
  open: boolean;
  onClose: () => void;
}

export const TransferSlide: React.FC<Props> = ({ transfer, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);

  const [txBlockchainEvents, setTxBlockchainEvents] = useState<
    IBlockchainEvent[]
  >([]);
  const [txOperations, setTxOperations] = useState<IOperation[]>([]);
  const [txStatus, setTxStatus] = useState<ITxStatus>();

  useEffect(() => {
    // Transaction Status
    fetchCatcher(
      `${
        FF_Paths.nsPrefix
      }/${selectedNamespace}${FF_Paths.transactionByIdStatus(transfer.tx.id)}`
    )
      .then((txStatus: ITxStatus) => {
        setTxStatus(txStatus);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Transaction Operations
    fetchCatcher(
      `${
        FF_Paths.nsPrefix
      }/${selectedNamespace}${FF_Paths.transactionByIdOperations(
        transfer.tx.id
      )}`
    )
      .then((txOperations: IOperation[]) => {
        setTxOperations(txOperations);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Transaction Blockchain Events
    fetchCatcher(
      `${
        FF_Paths.nsPrefix
      }/${selectedNamespace}${FF_Paths.transactionByIdBlockchainEvents(
        transfer.tx.id
      )}`
    )
      .then((txBlockchainEvents: IBlockchainEvent[]) => {
        setTxBlockchainEvents(txBlockchainEvents);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [transfer]);

  const dataList: IDataListItem[] = [
    {
      label: t('localID'),
      value: transfer.localId,
      button: <FFCopyButton value={transfer.localId} />,
    },
    {
      label: t('poolID'),
      value: transfer.pool,
      button: <FFCopyButton value={transfer.pool} />,
    },
    {
      label: t('transactionID'),
      value: transfer.tx.id,
      button: <FFCopyButton value={transfer.tx.id} />,
    },
    {
      label: t('authorKey'),
      value: transfer.key,
      button: <FFCopyButton value={transfer.key} />,
    },
    {
      label: t('messageID'),
      value: transfer.message ?? t('noMessageInTransfer'),
      button: transfer.message ? (
        <FFCopyButton value={transfer.message} />
      ) : undefined,
    },
    {
      label: t('status'),
      value: txStatus && (
        <Chip
          label={txStatus.status.toLocaleUpperCase()}
          sx={{ backgroundColor: TxStatusColorMap[txStatus.status] }}
        ></Chip>
      ),
    },
    {
      label: t('created'),
      value: dayjs(transfer.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader
            subtitle={t('tokenTransfer')}
            title={t(FF_TRANSFER_CATEGORY_MAP[transfer.type].nicename)}
          />
          {/* Data list */}
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Operations */}
          {txOperations.length && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.activityOpPath(selectedNamespace)}
                title={t('operations')}
              />
              <Grid container item>
                {txOperations?.map((op, idx) => (
                  <OperationAccordion op={op} key={idx} />
                ))}
              </Grid>
            </>
          )}
          {/* Blockchain Events */}
          {txBlockchainEvents.length && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.blockchainEventsPath(selectedNamespace)}
                title={t('blockchainEvents')}
              />
              <Grid container item>
                {txBlockchainEvents?.map((be, idx) => (
                  <BlockchainEventAccordion key={idx} be={be} />
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
