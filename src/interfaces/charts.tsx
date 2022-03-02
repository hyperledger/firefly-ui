import { EventKeyEnum, TransferKeyEnum } from '.';

export interface IEventBucket {
  [EventKeyEnum.BLOCKCHAIN]: number;
  [EventKeyEnum.MESSAGES]: number;
  [EventKeyEnum.TOKENS]: number;
}

export interface IMessageBucket {
  [EventKeyEnum.BLOCKCHAIN]: number;
  [EventKeyEnum.MESSAGES]: number;
  [EventKeyEnum.TOKENS]: number;
}

export interface ITransferBucket {
  [TransferKeyEnum.MINT]: number;
  [TransferKeyEnum.TRANSFER]: number;
  [TransferKeyEnum.BURN]: number;
}

export interface IHistEventTimeMap {
  [key: string]: IEventBucket;
}

export interface IHistMessageTimeMap {
  [key: string]: IEventBucket;
}

export interface IHistOperationTimeMap {
  [key: string]: IEventBucket;
}

export interface IHistTransferTimeMap {
  [key: string]: ITransferBucket;
}

export enum BucketCollectionEnum {
  Events = 'events',
  Messages = 'messages',
  Operations = 'operations',
  TokenTransfers = 'tokentransfers',
}

export enum BucketCountEnum {
  Small = 12,
  Medium = 25,
  Large = 40,
}
