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
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Chip,
  Grid,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  IMessage,
  IMessageData,
  IMessageEvent,
  IMessageOperation,
  IMessageTransaction,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { OpStatusColorMap } from '../../interfaces/enums';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { FFCopyButton } from '../Buttons/CopyButton';
import { HashPopover } from '../Popovers/HashPopover';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';
import { DrawerPanel, IOperationListItem } from './Panel';

interface Props {
  message: IMessage;
  open: boolean;
  onClose: () => void;
}

export const MessageSlide: React.FC<Props> = ({ message, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);

  const [msgBlockchainEvents, setMsgBlockchainEvents] = useState<
    IMessageEvent[]
  >([]);
  const [msgData, setMsgData] = useState<IMessageData[]>([]);
  const [msgOperations, setMsgOperations] = useState<IMessageOperation[]>([]);
  const [msgTransaction, setMsgTransaction] = useState<IMessageTransaction>();

  const [openDataModal, setOpenDataModal] = useState(false);
  const [dataModalText, setDataModalText] = useState('');
  const handleDataModalOpen = (text: string) => {
    setDataModalText(text);
    setOpenDataModal(true);
  };
  const handleDataModalClose = () => {
    setOpenDataModal(false);
    setDataModalText('');
  };

  useEffect(() => {
    // Message events
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messageEventsById(
        message.header.id
      )}`
    )
      .then((events: IMessageEvent[]) => {
        setMsgBlockchainEvents(events);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Message Data
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messageDataById(
        message.header.id
      )}`
    )
      .then((msgData: IMessageData[]) => {
        setMsgData(msgData);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Message Operations
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messageOpsById(
        message.header.id
      )}`
    )
      .then((msgOps: IMessageOperation[]) => {
        setMsgOperations(msgOps);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    // Message Transaction
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messageTxById(
        message.header.id
      )}`
    )
      .then((msgTx: IMessageTransaction) => {
        setMsgTransaction(msgTx);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [message]);

  const dataList: IDataListItem[] = [
    {
      label: t('id'),
      value: message.header.id,
      button: <FFCopyButton value={message.header.id} />,
    },
    {
      label: t('transactionType'),
      value: message.header.txtype.toLocaleUpperCase(),
      button: <FFCopyButton value={message.header.txtype} />,
    },
    {
      label: t('author'),
      value: message.header.author,
      button: <FFCopyButton value={message.header.author} />,
    },
    {
      label: t('authorKey'),
      value: message.header.key,
      button: <FFCopyButton value={message.header.key} />,
    },
    {
      label: t('tag'),
      value: message.header.tag ?? t('noTagInMessage'),
      button: message.header.tag ? (
        <FFCopyButton value={message.header.tag} />
      ) : undefined,
    },
    {
      label: t('status'),
      value: (
        <Chip label={message.state.toLocaleUpperCase()} color="success"></Chip>
      ),
    },
    {
      label: t('confirmed'),
      value: dayjs(message.confirmed).format('MM/DD/YYYY h:mm A'),
    },
  ];

  const msgDataList: IOperationListItem[] = msgData?.map((data) => {
    return {
      label: data.id,
      value: (
        <Typography>
          {dayjs(data.created).format('MM/DD/YYYY h:mm A')}
        </Typography>
      ),
      badge: <Chip label={data.validator} size="small"></Chip>,
      button: (
        <IconButton onClick={() => handleDataModalOpen(data.value || '')}>
          <VisibilityIcon />
        </IconButton>
      ),
    };
  });

  const operationsList: IOperationListItem[] = msgOperations?.map((op) => {
    return {
      label: op.type.toLocaleUpperCase(),
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

  const blockchainEventsList: IOperationListItem[] = msgBlockchainEvents?.map(
    (be) => {
      return {
        label: be.type.toLocaleUpperCase(),
        value: <HashPopover address={be.id} shortHash={true}></HashPopover>,
        button: (
          <IconButton>
            <ArrowForwardIcon />
          </IconButton>
        ),
      };
    }
  );

  const msgTransactionItem: IOperationListItem = {
    label: msgTransaction?.type.toLocaleUpperCase() ?? '',
    value: (
      <HashPopover
        address={msgTransaction?.id ?? ''}
        shortHash={true}
      ></HashPopover>
    ),
    button: (
      <IconButton>
        <ArrowForwardIcon />
      </IconButton>
    ),
  };

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <Grid item pb={5}>
            <Typography variant="subtitle1">{t('message')}</Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: '14',
                textTransform: 'uppercase',
              }}
            >
              {message.header.type}
            </Typography>
          </Grid>
          {/* Data list */}
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Message Attached Data */}
          <Grid item py={DEFAULT_PADDING}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              {`${t('messageData')} (${msgDataList?.length})`}
            </Typography>
          </Grid>
          <Grid container item>
            {msgDataList?.map((data, idx) => (
              <DrawerPanel key={idx} item={data} />
            ))}
          </Grid>
          {/* Operations */}
          <Grid item py={DEFAULT_PADDING}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              {`${t('operations')} (${operationsList?.length})`}
            </Typography>
          </Grid>
          <Grid container item>
            {operationsList?.map((op, idx) => (
              <DrawerPanel key={idx} item={op} />
            ))}
          </Grid>
          {/* Blockchain Events */}
          <Grid item py={DEFAULT_PADDING}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              {`${t('blockchainEvents')} (${blockchainEventsList?.length})`}
            </Typography>
          </Grid>
          <Grid container item>
            {blockchainEventsList?.map((be, idx) => (
              <DrawerPanel key={idx} item={be} />
            ))}
          </Grid>
          {/* Message Transaction */}
          <Grid item py={DEFAULT_PADDING}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              {`${t('messageTransaction')}`}
            </Typography>
          </Grid>
          <Grid container item>
            <DrawerPanel item={msgTransactionItem} />
          </Grid>
        </Grid>
      </DisplaySlide>
      <Modal
        open={openDataModal}
        onClose={handleDataModalClose}
        sx={{ wordWrap: 'break-word' }}
      >
        <Paper sx={modalStyle}>
          <Typography>{JSON.stringify(dataModalText, null, 2)}</Typography>
          <Grid pt={DEFAULT_PADDING} container justifyContent="center">
            <FFCopyButton
              longForm
              value={JSON.stringify(dataModalText, null, 2)}
            />
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: 'absolute' as const,
  overflow: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  wordWrap: 'break-word',
};
