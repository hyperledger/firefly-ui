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

export const FF_TRANSFER_CATEGORY_MAP: { [key: string]: IBlockchainCategory } =
  {
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
