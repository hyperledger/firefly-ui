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

import ApprovalIcon from '@mui/icons-material/Approval';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

export interface IHistTransferBucket {
  [TransferCategoryEnum.MINT]: number;
  [TransferCategoryEnum.BURN]: number;
  [TransferCategoryEnum.TRANSFER]: number;
}

export interface IHistTransferTimeMap {
  [key: string]: IHistTransferBucket;
}

export enum TransferCategoryEnum {
  MINT = 'Mint',
  BURN = 'Burn',
  TRANSFER = 'Transfer',
}

export const PoolStateColorMap: { [key: string]: string } = {
  unknown: FFColors.Red,
  confirmed: FFColors.Purple,
  pending: FFColors.Orange,
};

export enum FF_TRANSFERS {
  MINT = 'mint',
  BURN = 'burn',
  TRANSFER = 'transfer',
}

export const FF_TRANSFER_CATEGORY_MAP: {
  [key in FF_TRANSFERS]: IBlockchainCategory;
} = {
  [FF_TRANSFERS.MINT]: {
    category: TransferCategoryEnum.MINT,
    color: FFColors.Pink,
    nicename: 'mint',
  },
  [FF_TRANSFERS.TRANSFER]: {
    category: TransferCategoryEnum.TRANSFER,
    color: FFColors.Yellow,
    nicename: 'transfer',
  },
  [FF_TRANSFERS.BURN]: {
    category: TransferCategoryEnum.BURN,
    color: FFColors.Orange,
    nicename: 'burn',
  },
};

export const TransferIconMap = {
  [TransferCategoryEnum.BURN.toLowerCase()]: <LocalFireDepartmentIcon />,
  [TransferCategoryEnum.MINT.toLowerCase()]: <ApprovalIcon />,
  [TransferCategoryEnum.TRANSFER.toLowerCase()]: <SwapHorizIcon />,
};
