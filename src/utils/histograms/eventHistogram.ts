import { BarDatum } from '@nivo/bar';
import {
  EventCategoryEnum,
  FF_EVENTS,
  FF_EVENTS_CATEGORY_MAP,
  IHistEventTimeMap,
  IMetric,
} from '../../interfaces';

export const makeEventHistogram = (histList: IMetric[]): BarDatum[] => {
  const timeMap: IHistEventTimeMap = {};
  histList.map((hist) => {
    timeMap[hist.timestamp] = {
      [EventCategoryEnum.BLOCKCHAIN]: 0,
      [EventCategoryEnum.MESSAGES]: 0,
      [EventCategoryEnum.TOKENS]: 0,
    };
    hist.types.map((type) => {
      switch (FF_EVENTS_CATEGORY_MAP[type.type as FF_EVENTS]?.category) {
        // Blockchain
        case EventCategoryEnum.BLOCKCHAIN:
          timeMap[hist.timestamp][EventCategoryEnum.BLOCKCHAIN] =
            timeMap[hist.timestamp][EventCategoryEnum.BLOCKCHAIN] + +type.count;
          break;
        // Message
        case EventCategoryEnum.MESSAGES:
          timeMap[hist.timestamp][EventCategoryEnum.MESSAGES] =
            timeMap[hist.timestamp][EventCategoryEnum.MESSAGES] + +type.count;
          break;
        // Tokens
        case EventCategoryEnum.TOKENS:
          timeMap[hist.timestamp][EventCategoryEnum.TOKENS] =
            timeMap[hist.timestamp][EventCategoryEnum.TOKENS] + +type.count;
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
