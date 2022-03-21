import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

export interface IHistBlockchainEventBucket {
  [BlockchainEventCategoryEnum.BLOCKCHAINEVENT]: number;
}

export interface IHistBlockchainEventTimeMap {
  [key: string]: IHistBlockchainEventBucket;
}

export enum BlockchainEventCategoryEnum {
  BLOCKCHAINEVENT = 'Blockchain Event',
}

export const FF_BE_CATEGORY_MAP: {
  [key in BlockchainEventCategoryEnum]: IBlockchainCategory;
} = {
  [BlockchainEventCategoryEnum.BLOCKCHAINEVENT]: {
    category: BlockchainEventCategoryEnum.BLOCKCHAINEVENT,
    color: FFColors.Yellow,
    nicename: 'blockchainEventReceived',
  },
};
