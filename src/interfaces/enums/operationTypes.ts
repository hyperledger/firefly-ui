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

export interface IHistOpBucket {
  [OpCategoryEnum.BLOCKCHAIN]: number;
  [OpCategoryEnum.MESSAGES]: number;
  [OpCategoryEnum.TOKENS]: number;
}

export interface IHistOpTimeMap {
  [key: string]: IHistOpBucket;
}

export enum OpCategoryEnum {
  BLOCKCHAIN = 'Blockchain',
  MESSAGES = 'Messages',
  TOKENS = 'Tokens',
}

export enum OperationStatus {
  FAILED = 'Failed',
  PENDING = 'Pending',
  SUCCEEDED = 'Succeeded',
}

export const OpStatusColorMap: { [key: string]: string } = {
  Succeeded: FFColors.Purple,
  Pending: FFColors.Orange,
  Failed: FFColors.Red,
};

export enum FF_OPS {
  // Blockchain Event
  BLOCKCHAIN_BATCH_PIN = 'blockchain_batch_pin',
  BLOCKCHAIN_INVOKE = 'blockchain_invoke',
  //Message/Definitions
  SHAREDSTORAGE_BATCH_BROADCAST = 'sharedstorage_batch_broadcast',
  DATAEXCHANGE_BATCH_SEND = 'dataexchange_batch_send',
  DATAEXCHANGE_BLOB_SEND = 'dataexchange_blob_send',
  // Transfers
  TOKEN_CREATE_POOL = 'token_create_pool',
  TOKEN_ACTIVATE_POOL = 'token_activate_pool',
  TOKEN_TRANSFER = 'token_transfer',
  TOKEN_APPROVAL = 'token_approval',
}

export const FF_OP_CATEGORY_MAP: { [key: string]: IBlockchainCategory } = {
  // Blockchain Events
  [FF_OPS.BLOCKCHAIN_BATCH_PIN]: {
    category: OpCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainBatchPin',
  },
  [FF_OPS.BLOCKCHAIN_INVOKE]: {
    category: OpCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainInvoke',
  },
  // Message Events
  [FF_OPS.SHAREDSTORAGE_BATCH_BROADCAST]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'sharedStorageBatchBroadcast',
  },
  [FF_OPS.DATAEXCHANGE_BATCH_SEND]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'dataExchangeBatchSend',
  },
  [FF_OPS.DATAEXCHANGE_BLOB_SEND]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'dataExchangeBlobSend',
  },
  // Token Events
  [FF_OPS.TOKEN_CREATE_POOL]: {
    category: OpCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenCreatePool',
  },
  [FF_OPS.TOKEN_ACTIVATE_POOL]: {
    category: OpCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenActivatePool',
  },
  [FF_OPS.TOKEN_TRANSFER]: {
    category: OpCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenTransfer',
  },
  [FF_OPS.TOKEN_APPROVAL]: {
    category: OpCategoryEnum.TOKENS,
    color: FFColors.Pink,
    nicename: 'tokenApproval',
  },
};
