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
  IMessage,
  IMessageData,
  IMessageTransaction,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { FF_MESSAGES_CATEGORY_MAP } from '../../interfaces/enums';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { MessageDataAccordion } from '../Accordions/MessageDataAccordion';
import { TransactionAccordion } from '../Accordions/TransactionAccordion';
import { MessageList } from '../Lists/MessageList';
import { DisplaySlide } from './DisplaySlide';
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

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader
            subtitle={t('message')}
            title={t(FF_MESSAGES_CATEGORY_MAP[message.header.type]?.nicename)}
          />
          {/* Data list */}
          <Grid container item>
            <MessageList message={message} />
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
                clickPath={FF_NAV_PATHS.activityTxDetailPath(
                  selectedNamespace,
                  msgTransaction.id
                )}
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
