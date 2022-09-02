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

export interface IHistTxBucket {
  [TxCategoryEnum.BLOCKCHAIN]: number;
  [TxCategoryEnum.MESSAGES]: number;
  [TxCategoryEnum.TOKENS]: number;
  Truncated: number;
}

export interface IHistTxTimeMap {
  [key: string]: IHistTxBucket;
}

export enum TxCategoryEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}

export enum TransactionStatus {
  FAILED = 'Failed',
  PENDING = 'Pending',
  SUCCEEDED = 'Succeeded',
}

export const TxStatusColorMap: { [key: string]: string } = {
  Succeeded: FFColors.Purple,
  Pending: FFColors.Orange,
  Failed: FFColors.Red,
};

export enum FF_TX {
  NONE = 'none',
  // Blockchain Event
  CONTRACT_INVOKE = 'contract_invoke',
  NETWORK_ACTION = 'network_action',
  //Message/Definitions
  BATCH_PIN = 'batch_pin',
  UNPINNED = 'unpinned',
  // Transfers
  TOKEN_APPROVAL = 'token_approval',
  TOKEN_POOL = 'token_pool',
  TOKEN_TRANSFER = 'token_transfer',
  // Data Publishing
  DATA_PUBLISH = 'data_publish',
}

export const FF_TX_CATEGORY_MAP: { [key in FF_TX]: IBlockchainCategory } = {
  // Blockchain Events
  [FF_TX.CONTRACT_INVOKE]: {
    category: TxCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractInvoke',
  },
  [FF_TX.NETWORK_ACTION]: {
    category: TxCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'networkAction',
  },
  [FF_TX.NONE]: {
    category: TxCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'none',
  },
  // Message Events
  [FF_TX.BATCH_PIN]: {
    category: TxCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'batchPin',
  },
  [FF_TX.UNPINNED]: {
    category: TxCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'unpinned',
  },
  // Tokens Events
  [FF_TX.TOKEN_APPROVAL]: {
    category: TxCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApproval',
  },
  [FF_TX.TOKEN_POOL]: {
    category: TxCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenPool',
  },
  [FF_TX.TOKEN_TRANSFER]: {
    category: TxCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransfer',
  },
  [FF_TX.DATA_PUBLISH]: {
    category: TxCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'dataPublish',
  },
};
