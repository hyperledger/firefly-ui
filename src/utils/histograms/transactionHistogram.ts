import { BarDatum } from '@nivo/bar';
import { IMetric } from '../../interfaces';
import {
  FF_TX,
  FF_TX_CATEGORY_MAP,
  IHistTxTimeMap,
  TxCategoryEnum,
} from '../../interfaces/enums/transactionTypes';

export const makeTxHistogram = (histList: IMetric[]): BarDatum[] => {
  const timeMap: IHistTxTimeMap = {};
  histList.map((hist) => {
    timeMap[hist.timestamp] = {
      [TxCategoryEnum.BLOCKCHAIN]: 0,
      [TxCategoryEnum.MESSAGES]: 0,
      [TxCategoryEnum.TOKENS]: 0,
    };
    hist.types.map((type) => {
      switch (FF_TX_CATEGORY_MAP[type.type as FF_TX]?.category) {
        // Blockchain
        case TxCategoryEnum.BLOCKCHAIN:
          timeMap[hist.timestamp][TxCategoryEnum.BLOCKCHAIN] =
            timeMap[hist.timestamp][TxCategoryEnum.BLOCKCHAIN] + +type.count;
          break;
        // Message
        case TxCategoryEnum.MESSAGES:
          timeMap[hist.timestamp][TxCategoryEnum.MESSAGES] =
            timeMap[hist.timestamp][TxCategoryEnum.MESSAGES] + +type.count;
          break;
        // Tokens
        case TxCategoryEnum.TOKENS:
          timeMap[hist.timestamp][TxCategoryEnum.TOKENS] =
            timeMap[hist.timestamp][TxCategoryEnum.TOKENS] + +type.count;
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
