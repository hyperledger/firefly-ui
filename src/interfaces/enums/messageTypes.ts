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

import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

export interface IHistMsgBucket {
  [MsgCategoryEnum.BROADCAST]: number;
  [MsgCategoryEnum.DEFINITON]: number;
  [MsgCategoryEnum.PRIVATE]: number;
}

export interface IHistMsgTimeMap {
  [key: string]: IHistMsgBucket;
}

export enum MsgCategoryEnum {
  BROADCAST = 'Broadcast',
  DEFINITON = 'Definition',
  PRIVATE = 'Private',
}

export enum MessageStatus {
  STAGED = 'staged',
  READY = 'ready',
  SENT = 'sent',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
}

export const MsgStateColorMap = {
  [MessageStatus.STAGED]: FFColors.Pink,
  [MessageStatus.READY]: FFColors.Pink,
  [MessageStatus.SENT]: FFColors.Yellow,
  [MessageStatus.PENDING]: FFColors.Orange,
  [MessageStatus.CONFIRMED]: FFColors.Purple,
  [MessageStatus.REJECTED]: FFColors.Red,
};

export enum FF_MESSAGES {
  // Definition
  DEFINITON = 'definition',
  // Broadcast
  BROADCAST = 'broadcast',
  TRANSFER_BROADCAST = 'transfer_broadcast',
  // Private
  PRIVATE = 'private',
  TRANSFER_PRIVATE = 'transfer_private',
  GROUP_INIT = 'groupinit',
}

export const FF_MESSAGES_CATEGORY_MAP: {
  [key in FF_MESSAGES]: IBlockchainCategory;
} = {
  // Definition
  [FF_MESSAGES.DEFINITON]: {
    category: MsgCategoryEnum.DEFINITON,
    color: FFColors.Yellow,
    nicename: 'definition',
  },
  // Broadcast
  [FF_MESSAGES.BROADCAST]: {
    category: MsgCategoryEnum.BROADCAST,
    color: FFColors.Orange,
    nicename: 'broadcast',
  },
  [FF_MESSAGES.TRANSFER_BROADCAST]: {
    category: MsgCategoryEnum.BROADCAST,
    color: FFColors.Orange,
    nicename: 'transferBroadcast',
  },
  // Private
  [FF_MESSAGES.PRIVATE]: {
    category: MsgCategoryEnum.PRIVATE,
    color: FFColors.Pink,
    nicename: 'private',
  },
  [FF_MESSAGES.TRANSFER_PRIVATE]: {
    category: MsgCategoryEnum.PRIVATE,
    color: FFColors.Pink,
    nicename: 'transferPrivate',
  },
  [FF_MESSAGES.GROUP_INIT]: {
    category: MsgCategoryEnum.PRIVATE,
    color: FFColors.Pink,
    nicename: 'groupInit',
  },
};
