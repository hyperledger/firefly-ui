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

import { LaunchButton } from '../../components/Buttons/LaunchButton';
import { FFColors } from '../../theme';
import { FF_NAV_PATHS } from '../navigation';

interface ITxStatusCategory {
  category: string;
  color: string;
  enrichedEventKey?: string;
  enrichedEventString?: (key: any) => string;
  nicename: string;
  referenceIDButton: (ns: string, refID: string) => JSX.Element;
}

export enum FF_TX_STATUS {
  OPERATION = 'Operation',
  BLOCKCHAIN_EVENT = 'BlockchainEvent',
  BATCH = 'Batch',
  TOKEN_POOL = 'TokenPool',
  TOKEN_TRANSFER = 'TokenTransfer',
  TOKEN_APPROVAL = 'TokenApproval',
}

export const FF_TX_STATUS_CATEGORY_MAP: {
  [key in FF_TX_STATUS]: ITxStatusCategory;
} = {
  [FF_TX_STATUS.OPERATION]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'operation',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.activityOpPath(ns, refID)} />
    ),
  },
  [FF_TX_STATUS.BLOCKCHAIN_EVENT]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'blockchainEvent',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.blockchainEventsPath(ns, refID)} />
    ),
  },
  [FF_TX_STATUS.BATCH]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'batch',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.offchainBatchesPath(ns, refID)} />
    ),
  },
  [FF_TX_STATUS.TOKEN_POOL]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'tokenPool',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensPoolDetailsPath(ns, refID)} />
    ),
  },
  [FF_TX_STATUS.TOKEN_TRANSFER]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'tokenTransfer',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensTransfersPathLocalID(ns, refID)} />
    ),
  },
  [FF_TX_STATUS.TOKEN_APPROVAL]: {
    category: '',
    color: FFColors.Yellow,
    nicename: 'tokenApproval',
    referenceIDButton: (ns: string, refID: string): JSX.Element => (
      <LaunchButton link={FF_NAV_PATHS.tokensApprovalsPath(ns, refID)} />
    ),
  },
};
