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

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Chip, Grid, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  ACTIVITY_PATH,
  BLOCKCHAIN_PATH,
  EVENTS_PATH,
  FF_EVENTS_CATEGORY_MAP,
  IBlockchainEvent,
  IEvent,
  IOperation,
  ITransaction,
  ITxStatus,
  NAMESPACES_PATH,
  OPERATIONS_PATH,
  TxStatusColorMap,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { BlockchainEventAccordion } from '../Accordions/BlockchainEvent';
import { OperationAccordion } from '../Accordions/Operation';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';

interface Props {
  event?: IEvent;
  open: boolean;
  transaction?: ITransaction;
  onClose: () => void;
}

export const EventTransactionSlide: React.FC<Props> = ({
  event,
  open,
  transaction,
  onClose,
}) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const opsPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${ACTIVITY_PATH}/${OPERATIONS_PATH}`;
  const bePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${BLOCKCHAIN_PATH}/${EVENTS_PATH}`;

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
      }/${selectedNamespace}${FF_Paths.transactionByIdStatus(
        event?.tx ?? transaction?.id ?? ''
      )}`
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
        event?.tx ?? transaction?.id ?? ''
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
        event?.tx ?? transaction?.id ?? ''
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
      value: event?.tx ?? transaction?.id ?? '',
      button: <FFCopyButton value={event?.tx ?? transaction?.id ?? ''} />,
    },
    {
      label: t('status'),
      value: txStatus && (
        <Chip
          label={txStatus.status}
          sx={{ backgroundColor: TxStatusColorMap[txStatus.status] }}
        ></Chip>
      ),
    },
    {
      label: t('timestamp'),
      value: dayjs(event?.created ?? transaction?.created).format(
        'MM/DD/YYYY h:mm A'
      ),
    },
  ];

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Title */}
          <Grid item pb={5}>
            <Typography variant="subtitle1">{t('transaction')}</Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: '14',
                textTransform: 'uppercase',
              }}
            >
              {event?.type && t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
              {transaction?.type &&
                t(FF_TX_CATEGORY_MAP[transaction.type].nicename)}
            </Typography>
          </Grid>
          {/* Data list */}
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Operations */}
          {txOperations ? (
            txOperations.length ? (
              <>
                <Grid
                  container
                  item
                  py={DEFAULT_PADDING}
                  direction="row"
                  alignItems="center"
                >
                  <Grid xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '12',
                      }}
                    >
                      {`${t('recentOperations')}`}
                    </Typography>
                  </Grid>
                  <Grid xs={6} container justifyContent="flex-end">
                    <IconButton onClick={() => navigate(opsPath)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid container item>
                  {txOperations?.length ? (
                    txOperations.map((op) => <OperationAccordion op={op} />)
                  ) : (
                    <FFCircleLoader color="warning" />
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )
          ) : (
            <FFCircleLoader color="warning" />
          )}
          {/* Blockchain Events */}
          {txBlockchainEvents ? (
            txBlockchainEvents.length ? (
              <>
                <Grid
                  container
                  item
                  py={DEFAULT_PADDING}
                  direction="row"
                  alignItems="center"
                >
                  <Grid xs={6}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '12',
                      }}
                    >
                      {`${t('recentBlockchainEvents')}`}
                    </Typography>
                  </Grid>
                  <Grid xs={6} container justifyContent="flex-end">
                    <IconButton onClick={() => navigate(bePath)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid container item>
                  {txBlockchainEvents ? (
                    txBlockchainEvents.map((be) => (
                      <BlockchainEventAccordion be={be} />
                    ))
                  ) : (
                    <FFCircleLoader color="warning" />
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )
          ) : (
            <FFCircleLoader color="warning" />
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
