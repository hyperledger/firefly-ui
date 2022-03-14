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
  ITransaction,
  ITxStatus,
  TxStatusColorMap,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
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
  open: boolean;
  transaction: ITransaction;
  onClose: () => void;
}

export const TransactionSlide: React.FC<Props> = ({
  open,
  transaction,
  onClose,
}) => {
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
      }/${selectedNamespace}${FF_Paths.transactionByIdStatus(transaction.id)}`
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
        transaction.id
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
        transaction.id
      )}`
    )
      .then((txBlockchainEvents: IBlockchainEvent[]) => {
        setTxBlockchainEvents(txBlockchainEvents);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [event]);

  const dataList: IDataListItem[] = [
    {
      label: t('id'),
      value: transaction.id,
      button: <FFCopyButton value={transaction.id} />,
    },
    {
      label: t('status'),
      value: txStatus && (
        <Chip
          label={txStatus.status?.toLocaleUpperCase()}
          sx={{ backgroundColor: TxStatusColorMap[txStatus.status] }}
        ></Chip>
      ),
    },
    {
      label: t('created'),
      value: dayjs(transaction.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Title */}
          <SlideHeader
            subtitle={t('transaction')}
            title={t(FF_TX_CATEGORY_MAP[transaction.type].nicename)}
          />
          {/* Data list */}
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Operations */}
          {txOperations?.length > 0 && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.activityOpPath(selectedNamespace)}
                title={t('recentOperations')}
              />
              <Grid container item>
                {txOperations?.map((op) => (
                  <OperationAccordion op={op} />
                ))}
              </Grid>
            </>
          )}
          {/* Blockchain Events */}
          {txBlockchainEvents?.length > 0 && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.blockchainEventsPath(selectedNamespace)}
                title={t('recentBlockchainEvents')}
              />
              <Grid container item>
                {txBlockchainEvents?.map((be) => (
                  <BlockchainEventAccordion be={be} />
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
