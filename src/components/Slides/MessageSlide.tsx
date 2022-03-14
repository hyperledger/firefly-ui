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
  IMessage,
  IMessageData,
  IMessageTransaction,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import {
  FF_MESSAGES_CATEGORY_MAP,
  MsgStateColorMap,
} from '../../interfaces/enums';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { MessageDataAccordion } from '../Accordions/MessageData';
import { TransactionAccordion } from '../Accordions/Transaction';
import { FFCopyButton } from '../Buttons/CopyButton';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  message: IMessage;
  open: boolean;
  onClose: () => void;
}

export const MessageSlide: React.FC<Props> = ({ message, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);

  const [msgData, setMsgData] = useState<IMessageData[]>([]);
  const [msgTransaction, setMsgTransaction] = useState<IMessageTransaction>();

  useEffect(() => {
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
      value: t(FF_TX_CATEGORY_MAP[message.header.txtype].nicename).toString(),
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
      label: t('topics'),
      value: message.header.topics?.toString() ?? t('noTopicInMessage'),
    },
    {
      label: t('status'),
      value: (
        <Chip
          label={message.state.toLocaleUpperCase()}
          sx={{ backgroundColor: MsgStateColorMap[message.state] }}
        ></Chip>
      ),
    },
    {
      label: t('confirmed'),
      value: dayjs(message.confirmed).format('MM/DD/YYYY h:mm A'),
    },
  ];

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader
            subtitle={t('message')}
            title={t(FF_MESSAGES_CATEGORY_MAP[message.header.type].nicename)}
          />
          {/* Data list */}
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Message Attached Data */}
          {msgData.length > 0 && (
            <>
              <SlideSectionHeader title={t('messageData')} />
              <Grid container item>
                {msgData?.map((data, idx) => (
                  <MessageDataAccordion key={idx} data={data} />
                ))}
              </Grid>
            </>
          )}
          {/* Message Transaction */}
          {msgTransaction && (
            <>
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.activityTxPath(selectedNamespace)}
                title={t('messageTransaction')}
              />
              <Grid container item>
                <TransactionAccordion tx={msgTransaction} />
              </Grid>
            </>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
