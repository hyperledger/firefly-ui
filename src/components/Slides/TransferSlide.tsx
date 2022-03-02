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
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  ITokenTransfer,
  ITxBlockchainEvent,
  ITxOperation,
  ITxStatus,
  OpStatusColorMap,
  TransferColorMap,
  TxStatusColorMap,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { FFCopyButton } from '../Buttons/CopyButton';
import { HashPopover } from '../Popovers/HashPopover';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';
import { DrawerPanel, IOperationListItem } from './Panel';

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
    ITxBlockchainEvent[]
  >([]);
  const [txOperations, setTxOperations] = useState<ITxOperation[]>([]);
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
        transfer.tx.id
      )}`
    )
      .then((txBlockchainEvents: ITxBlockchainEvent[]) => {
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
      label: t('pool'),
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
          label={txStatus.status}
          sx={{ backgroundColor: TxStatusColorMap[txStatus.status] }}
        ></Chip>
      ),
    },
    {
      label: t('timestamp'),
      value: dayjs(transfer.created).format('MM/DD/YYYY h:mm A'),
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
          {/* Header */}
          <Grid item pb={5}>
            <Typography variant="subtitle1">{t('tokenTransfer')}</Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: '14',
                textTransform: 'uppercase',
                color: TransferColorMap[transfer.type],
              }}
            >
              {transfer.type}
            </Typography>
          </Grid>
          {/* Data list */}
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
