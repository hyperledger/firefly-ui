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
  Truncated: number;
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
  Retried: FFColors.Pink,
};

export enum FF_OPS {
  // Blockchain Event
  BLOCKCHAIN_PIN_BATCH = 'blockchain_pin_batch',
  BLOCKCHAIN_INVOKE = 'blockchain_invoke',
  BLOCKCHAIN_NETWORK_ACTION = 'blockchain_network_action',
  // Message/Definitions
  SHAREDSTORAGE_UPLOAD_BATCH = 'sharedstorage_upload_batch',
  SHAREDSTORAGE_UPLOAD_BLOB = 'sharedstorage_upload_blob',
  SHAREDSTORAGE_UPLOAD_VALUE = 'sharedstorage_upload_value',
  SHAREDSTORAGE_DOWNLOAD_BATCH = 'sharedstorage_download_batch',
  SHAREDSTORAGE_DOWNLOAD_BLOB = 'sharedstorage_download_blob',
  DATAEXCHANGE_SEND_BATCH = 'dataexchange_send_batch',
  DATAEXCHANGE_SEND_BLOB = 'dataexchange_send_blob',
  // Transfers
  TOKEN_CREATE_POOL = 'token_create_pool',
  TOKEN_ACTIVATE_POOL = 'token_activate_pool',
  TOKEN_TRANSFER = 'token_transfer',
  TOKEN_APPROVAL = 'token_approval',
}

export const FF_OP_CATEGORY_MAP: { [key in FF_OPS]: IBlockchainCategory } = {
  // Blockchain Events
  [FF_OPS.BLOCKCHAIN_PIN_BATCH]: {
    category: OpCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainBatchPin',
  },
  [FF_OPS.BLOCKCHAIN_INVOKE]: {
    category: OpCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainInvoke',
  },
  [FF_OPS.BLOCKCHAIN_NETWORK_ACTION]: {
    category: OpCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'blockchainNetworkAction',
  },
  // Message Events
  [FF_OPS.SHAREDSTORAGE_UPLOAD_BATCH]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'sharedStorageUploadBatch',
  },
  [FF_OPS.SHAREDSTORAGE_UPLOAD_VALUE]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'sharedStorageUploadValue',
  },
  [FF_OPS.SHAREDSTORAGE_UPLOAD_BLOB]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'sharedStorageUploadBlob',
  },
  [FF_OPS.SHAREDSTORAGE_DOWNLOAD_BATCH]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'sharedStorageDownloadBatch',
  },
  [FF_OPS.SHAREDSTORAGE_DOWNLOAD_BLOB]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'sharedStorageDownloadBlob',
  },
  [FF_OPS.DATAEXCHANGE_SEND_BATCH]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'dataExchangeSendBatch',
  },
  [FF_OPS.DATAEXCHANGE_SEND_BLOB]: {
    category: OpCategoryEnum.MESSAGES,
    color: FFColors.Orange,
    nicename: 'dataExchangeSendBlob',
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
