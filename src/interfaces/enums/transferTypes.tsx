import ApprovalIcon from '@mui/icons-material/Approval';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { IBlockchainCategory } from '.';
import { FFColors } from '../../theme';

export enum TransferCategoryEnum {
  MINT = 'Mint',
  BURN = 'Burn',
  TRANSFER = 'Transfer',
}

export interface IHistTransferBucket {
  [TransferCategoryEnum.MINT]: number;
  [TransferCategoryEnum.BURN]: number;
  [TransferCategoryEnum.TRANSFER]: number;
}

export interface IHistTransferTimeMap {
  [key: string]: IHistTransferBucket;
}

export const PoolStateColorMap = {
  unknown: FFColors.Red,
  confirmed: FFColors.Purple,
  pending: FFColors.Orange,
};

export const TransferColorMap = {
  mint: FFColors.Yellow,
  transfer: FFColors.Orange,
  burn: FFColors.Pink,
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
    [FF_TRANSFERS.BURN]: {
      category: TransferCategoryEnum.BURN,
      color: FFColors.Yellow,
      nicename: 'burn',
    },
    [FF_TRANSFERS.TRANSFER]: {
      category: TransferCategoryEnum.TRANSFER,
      color: FFColors.Orange,
      nicename: 'transfer',
    },
  };

export const TransferIconMap = {
  [TransferCategoryEnum.BURN.toLowerCase()]: <LocalFireDepartmentIcon />,
  [TransferCategoryEnum.MINT.toLowerCase()]: <ApprovalIcon />,
  [TransferCategoryEnum.TRANSFER.toLowerCase()]: <SwapHorizIcon />,
};
