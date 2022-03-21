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

export enum FF_TX_STATUS {
  OPERATION = 'Operation',
  BLOCKCHAIN_EVENT = 'BlockchainEvent',
  BATCH = 'Batch',
  TOKEN_POOL = 'TokenPool',
  TOKEN_TRANSFER = 'TokenTransfer',
  TOKEN_APPROVAL = 'TokenApproval',
}

export const FF_TX_STATUS_CATEGORY_MAP: {
  [key in FF_TX_STATUS]: IBlockchainCategory;
} = {
  [FF_TX_STATUS.OPERATION]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'operation',
  },
  [FF_TX_STATUS.BLOCKCHAIN_EVENT]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'blockchainEvent',
  },
  [FF_TX_STATUS.BATCH]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'batch',
  },
  [FF_TX_STATUS.TOKEN_POOL]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'tokenPool',
  },
  [FF_TX_STATUS.TOKEN_TRANSFER]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'tokenTransfer',
  },
  [FF_TX_STATUS.TOKEN_APPROVAL]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'tokenApproval',
  },
};
