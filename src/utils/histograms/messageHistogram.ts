import { BarDatum } from '@nivo/bar';
import { IMetric } from '../../interfaces';
import {
  FF_MESSAGES,
  FF_MESSAGES_CATEGORY_MAP,
  IHistMsgTimeMap,
  MsgCategoryEnum,
} from '../../interfaces/enums/messageTypes';

export const makeMsgHistogram = (histList: IMetric[]): BarDatum[] => {
  const timeMap: IHistMsgTimeMap = {};
  histList.map((hist) => {
    timeMap[hist.timestamp] = {
      [MsgCategoryEnum.BROADCAST]: 0,
      [MsgCategoryEnum.DEFINITON]: 0,
      [MsgCategoryEnum.PRIVATE]: 0,
    };
    hist.types.map((type) => {
      switch (FF_MESSAGES_CATEGORY_MAP[type.type as FF_MESSAGES]?.category) {
        // Blockchain
        case MsgCategoryEnum.BROADCAST:
          timeMap[hist.timestamp][MsgCategoryEnum.BROADCAST] =
            timeMap[hist.timestamp][MsgCategoryEnum.BROADCAST] + +type.count;
          break;
        // Definition
        case MsgCategoryEnum.DEFINITON:
          timeMap[hist.timestamp][MsgCategoryEnum.DEFINITON] =
            timeMap[hist.timestamp][MsgCategoryEnum.DEFINITON] + +type.count;
          break;
        // Private
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
