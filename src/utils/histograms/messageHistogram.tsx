import { BarDatum } from '@nivo/bar';
import { IMetric } from '../../interfaces';
import {
  FF_MESSAGES_CATEGORY_MAP,
  IHistMsgTimeMap,
  MsgCategoryEnum,
} from '../../interfaces/enums/messageTypes';

export const makeMsgHistogram = (histList: IMetric[]): BarDatum[] => {
  const timeMap: IHistMsgTimeMap = {};
  histList.map((hist) => {
    timeMap[hist.timestamp] = {
      [MsgCategoryEnum.BLOCKCHAIN]: 0,
      [MsgCategoryEnum.BROADCAST]: 0,
      [MsgCategoryEnum.PRIVATE]: 0,
    };
    hist.types.map((type) => {
      switch (FF_MESSAGES_CATEGORY_MAP[type.type].category) {
        // Blockchain
        case MsgCategoryEnum.BROADCAST:
          timeMap[hist.timestamp][MsgCategoryEnum.BROADCAST] =
            timeMap[hist.timestamp][MsgCategoryEnum.BROADCAST] + +type.count;
          break;
        // Message
        case MsgCategoryEnum.BLOCKCHAIN:
          timeMap[hist.timestamp][MsgCategoryEnum.BLOCKCHAIN] =
            timeMap[hist.timestamp][MsgCategoryEnum.BLOCKCHAIN] + +type.count;
          break;
        // Tokens
        case MsgCategoryEnum.PRIVATE:
          timeMap[hist.timestamp][MsgCategoryEnum.PRIVATE] =
            timeMap[hist.timestamp][MsgCategoryEnum.PRIVATE] + +type.count;
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
