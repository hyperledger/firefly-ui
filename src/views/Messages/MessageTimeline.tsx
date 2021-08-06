// Copyright © 2021 Kaleido, Inc.
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

import React, { useState, useEffect, useContext } from 'react';
import { IMessage, IHistory } from '../../interfaces';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';
import BroadcastIcon from 'mdi-react/BroadcastIcon';
import { DataTimeline } from '../../components/DataTimeline/DataTimeline';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { NamespaceContext } from '../../contexts/NamespaceContext';

interface Props {
  setViewMessage: React.Dispatch<React.SetStateAction<IMessage | undefined>>;
}

export const MessageTimeline: React.FC<Props> = ({ setViewMessage }) => {
  const history = useHistory<IHistory>();
  const { createdFilter, lastEvent } = useContext(ApplicationContext);
  const { selectedNamespace } = useContext(NamespaceContext);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    let createdFilterString = `created=>=${dayjs()
      .subtract(24, 'hours')
      .unix()}`;
    if (createdFilter === '30days') {
      createdFilterString = `created=>=${dayjs().subtract(30, 'days').unix()}`;
    }
    if (createdFilter === '7days') {
      createdFilterString = `created=>=${dayjs().subtract(7, 'days').unix()}`;
    }

    fetch(
      `/api/v1/namespaces/${selectedNamespace}/messages?${createdFilterString}`
    ).then(async (response) => {
      if (response.ok) {
        setMessages(await response.json());
      } else {
        console.log('error fetching messages');
      }
    });
  }, [selectedNamespace, createdFilter, lastEvent]);

  const buildTimelineElements = (messages: IMessage[]) => {
    return messages.map((message: IMessage) => ({
      key: message.header.id,
      title: message.header.type,
      description: message.header.tag,
      author: message.header.author,
      time: dayjs(message.header.created).format('MM/DD/YYYY h:mm A'),
      icon: <BroadcastIcon />,
      onClick: () => {
        setViewMessage(message);
        history.replace(`/namespace/${selectedNamespace}/messages`, {
          viewMessage: message,
        });
      },
    }));
  };

  return <DataTimeline items={buildTimelineElements(messages)} />;
};
