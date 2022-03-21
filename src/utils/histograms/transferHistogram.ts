import { BarDatum } from '@nivo/bar';
import { IMetric } from '../../interfaces';
import {
  FF_TRANSFERS,
  FF_TRANSFER_CATEGORY_MAP,
  IHistTransferTimeMap,
  TransferCategoryEnum,
} from '../../interfaces/enums/transferTypes';

export const makeTransferHistogram = (histList: IMetric[]): BarDatum[] => {
  const timeMap: IHistTransferTimeMap = {};
  histList?.map((hist) => {
    timeMap[hist.timestamp] = {
      [TransferCategoryEnum.MINT]: 0,
      [TransferCategoryEnum.BURN]: 0,
      [TransferCategoryEnum.TRANSFER]: 0,
    };
    hist.types.map((type) => {
      switch (FF_TRANSFER_CATEGORY_MAP[type.type as FF_TRANSFERS]?.category) {
        // Mint
        case TransferCategoryEnum.MINT:
          timeMap[hist.timestamp][TransferCategoryEnum.MINT] =
            timeMap[hist.timestamp][TransferCategoryEnum.MINT] + +type.count;
          break;
        // Burn
        case TransferCategoryEnum.BURN:
          timeMap[hist.timestamp][TransferCategoryEnum.BURN] =
            timeMap[hist.timestamp][TransferCategoryEnum.BURN] + +type.count;
          break;
        // Transfer
        case TransferCategoryEnum.TRANSFER:
          timeMap[hist.timestamp][TransferCategoryEnum.TRANSFER] =
            timeMap[hist.timestamp][TransferCategoryEnum.TRANSFER] +
            +type.count;
          break;
      }
    });
  });

  const finalHistogram: BarDatum[] = [];
  Object.entries(timeMap).map((k) => {
    finalHistogram.push({
      timestamp: k[0],
      ...k[1],
    });
  });

  return finalHistogram;
};
