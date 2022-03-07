import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

export interface IHistMsgBucket {
  [MsgCategoryEnum.BLOCKCHAIN]: number;
  [MsgCategoryEnum.BROADCAST]: number;
  [MsgCategoryEnum.PRIVATE]: number;
}

export interface IHistMsgTimeMap {
  [key: string]: IHistMsgBucket;
}

export enum MsgCategoryEnum {
  BLOCKCHAIN = 'Blockchain',
  BROADCAST = 'Broadcast',
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
  // Blockchain
  DEFINITON = 'definition',
  GROUP_INIT = 'groupinit',
  // Broadcast
  BROADCAST = 'broadcast',
  TRANSFER_BROADCAST = 'transfer_broadcast',
  // Private
  PRIVATE = 'private',
  TRANSFER_PRIVATE = 'transfer_private',
}

export const FF_MESSAGES_CATEGORY_MAP: { [key: string]: IBlockchainCategory } =
  {
    // Blockchain events
    [FF_MESSAGES.DEFINITON]: {
      category: MsgCategoryEnum.BLOCKCHAIN,
      color: FFColors.Yellow,
      nicename: 'definition',
    },
    [FF_MESSAGES.GROUP_INIT]: {
      category: MsgCategoryEnum.BLOCKCHAIN,
      color: FFColors.Yellow,
      nicename: 'groupInit',
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
  };
