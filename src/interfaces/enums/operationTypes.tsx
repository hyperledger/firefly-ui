import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

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
  [OperationStatus.SUCCEEDED]: FFColors.Purple,
  [OperationStatus.PENDING]: FFColors.Orange,
  [OperationStatus.FAILED]: FFColors.Red,
};

export interface IHistOpBucket {
  [OpCategoryEnum.BLOCKCHAIN]: number;
  [OpCategoryEnum.MESSAGES]: number;
  [OpCategoryEnum.TOKENS]: number;
}

export interface IHistOpTimeMap {
  [key: string]: IHistOpBucket;
}

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
