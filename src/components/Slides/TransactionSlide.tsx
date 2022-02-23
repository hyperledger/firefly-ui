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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Chip, Grid, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  IEvent,
  ITxBlockchainEvent,
  ITxOperation,
  ITxStatus,
  OpStatusColorMap,
  TxStatusColorMap,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';
import { DrawerPanel, IOperationListItem } from './Panel';

interface Props {
  event: IEvent;
  open: boolean;
  onClose: () => void;
}

export const TransactionSlide: React.FC<Props> = ({ event, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);

  const [txBlockchainEvents, setTxBlockchainEvents] = useState<
    ITxBlockchainEvent[]
  >([]);
  const [txOperations, setTxOperations] = useState<ITxOperation[]>([]);
  const [txStatus, setTxStatus] = useState<ITxStatus>();

  useEffect(() => {
    // Transaction Status
    fetchCatcher(
      `${
        FF_Paths.nsPrefix
      }/${selectedNamespace}${FF_Paths.transactionByIdStatus(event.tx)}`
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
      }/${selectedNamespace}${FF_Paths.transactionByIdOperations(event.tx)}`
    )
      .then((txOperations: ITxOperation[]) => {
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
        event.tx
      )}`
    )
      .then((txBlockchainEvents: ITxBlockchainEvent[]) => {
        setTxBlockchainEvents(txBlockchainEvents);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [event]);

  const dataList: IDataListItem[] = [
    {
      label: t('id'),
      value: event.tx,
      button: (
        <CopyToClipboard text={event.tx}>
          <IconButton>
            <ContentCopyIcon />
          </IconButton>
        </CopyToClipboard>
      ),
    },
    {
      label: t('type'),
      value: event.type,
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
      label: t('operations'),
      value: txOperations.length,
    },
    {
      label: t('timestamp'),
      value: dayjs(event.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  const operationsList: IOperationListItem[] = txOperations.map((op) => {
    return {
      label: op.type,
      value: <HashPopover address={op.id} shortHash={true}></HashPopover>,
      badge: (
        <Chip
          label={op.status}
          sx={{ backgroundColor: OpStatusColorMap[op.status] }}
          size="small"
        ></Chip>
      ),
      button: (
        <IconButton>
          <ArrowForwardIcon />
        </IconButton>
      ),
    };
  });

  const blockchainEventsList: IOperationListItem[] = txBlockchainEvents.map(
    (be) => {
      return {
        label: be.name,
        value: <HashPopover address={be.id} shortHash={true}></HashPopover>,
        button: (
          <IconButton>
            <ArrowForwardIcon />
          </IconButton>
        ),
      };
    }
  );

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Data */}
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
              {event.type}
            </Typography>
          </Grid>
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Operations */}
          <Grid item py={5}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              {`${t('operations')} (${operationsList.length})`}
            </Typography>
          </Grid>
          <Grid container item>
            {operationsList.map((op, idx) => (
              <DrawerPanel key={idx} item={op} />
            ))}
          </Grid>
          {/* Blockchain Events */}
          <Grid item py={5}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              {`${t('blockchainEvents')} (${blockchainEventsList.length})`}
            </Typography>
          </Grid>
          <Grid container item>
            {blockchainEventsList.map((be, idx) => (
              <DrawerPanel key={idx} item={be} />
            ))}
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};
