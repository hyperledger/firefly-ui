import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

export interface IHistTxBucket {
  [TxCategoryEnum.BLOCKCHAIN]: number;
  [TxCategoryEnum.MESSAGES]: number;
  [TxCategoryEnum.TOKENS]: number;
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
  // Blockchain Event
  CONTRACT_INVOKE = 'contract_invoke',
  //Message/Definitions
  BATCH_PIN = 'batch_pin',
  UNPINNED = 'unpinned',
  // Transfers
  TOKEN_APPROVAL = 'token_approval',
  TOKEN_POOL = 'token_pool',
  TOKEN_TRANSFER = 'token_transfer',
}

export const FF_TX_CATEGORY_MAP: { [key: string]: IBlockchainCategory } = {
  // Blockchain Events
  [FF_TX.CONTRACT_INVOKE]: {
    category: TxCategoryEnum.BLOCKCHAIN,
    color: FFColors.Yellow,
    nicename: 'contractInvoke',
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
};
