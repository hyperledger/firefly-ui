import { BarDatum } from '@nivo/bar';
import { IMetric } from '../../interfaces';
import {
  FF_OPS,
  FF_OP_CATEGORY_MAP,
  IHistOpTimeMap,
  OpCategoryEnum,
} from '../../interfaces/enums';

export const makeOperationHistogram = (histList: IMetric[]): BarDatum[] => {
  const timeMap: IHistOpTimeMap = {};
  histList.map((hist) => {
    timeMap[hist.timestamp] = {
      [OpCategoryEnum.BLOCKCHAIN]: 0,
      [OpCategoryEnum.MESSAGES]: 0,
      [OpCategoryEnum.TOKENS]: 0,
    };
    hist.types.map((type) => {
      switch (FF_OP_CATEGORY_MAP[type.type as FF_OPS]?.category) {
        // Blockchain
        case OpCategoryEnum.BLOCKCHAIN:
          timeMap[hist.timestamp][OpCategoryEnum.BLOCKCHAIN] =
            timeMap[hist.timestamp][OpCategoryEnum.BLOCKCHAIN] + +type.count;
          break;
        // Message
        case OpCategoryEnum.MESSAGES:
          timeMap[hist.timestamp][OpCategoryEnum.MESSAGES] =
            timeMap[hist.timestamp][OpCategoryEnum.MESSAGES] + +type.count;
          break;
        // Tokens
        case OpCategoryEnum.TOKENS:
          timeMap[hist.timestamp][OpCategoryEnum.TOKENS] =
            timeMap[hist.timestamp][OpCategoryEnum.TOKENS] + +type.count;
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
