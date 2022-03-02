import { BarDatum } from '@nivo/bar';
import {
  FF_MESSAGE_TYPES,
  IHistMessageTimeMap,
  IMetric,
  IMetricType,
  MessageKeyEnum,
} from '../../interfaces';

// Message types
const processMessageBuckets = (
  buckets: IMetric[],
  msgKey: MessageKeyEnum,
  timeMap: IHistMessageTimeMap
): IHistMessageTimeMap => {
  buckets.map((b) => {
    // Timestamp has already been recorded
    if (timeMap[b.timestamp]) {
      timeMap[b.timestamp][msgKey] = timeMap[b.timestamp][msgKey] + +b.count;
    } else {
      // Timestamp not yet recorded
      timeMap[b.timestamp] = {
        [MessageKeyEnum.BLOCKCHAIN]:
          msgKey === MessageKeyEnum.BLOCKCHAIN ? +b.count : 0,
        [MessageKeyEnum.MESSAGES]:
          msgKey === MessageKeyEnum.MESSAGES ? +b.count : 0,
        [MessageKeyEnum.TOKENS]:
          msgKey === MessageKeyEnum.TOKENS ? +b.count : 0,
      };
    }
  });

  return timeMap;
};

export const makeMessagesHistogram = (histList: IMetricType[]): BarDatum[] => {
  let histTimeMap: IHistMessageTimeMap = {};
  histList.map((hist) => {
    switch (hist.type) {
      // Message
      case FF_MESSAGE_TYPES.BROADCAST || FF_MESSAGE_TYPES.PRIVATE:
        histTimeMap = processMessageBuckets(
          hist.buckets,
          MessageKeyEnum.MESSAGES,
          histTimeMap
        );
        break;
      // Blockchain
      case FF_MESSAGE_TYPES.DEFINITION || FF_MESSAGE_TYPES.GROUP_INIT:
        histTimeMap = processMessageBuckets(
          hist.buckets,
          MessageKeyEnum.BLOCKCHAIN,
          histTimeMap
        );
        break;
      // Tokens
      case FF_MESSAGE_TYPES.TRANSFER_BROADCAST ||
        FF_MESSAGE_TYPES.TRANSFER_PRIVATE:
        histTimeMap = processMessageBuckets(
          hist.buckets,
          MessageKeyEnum.TOKENS,
          histTimeMap
        );
        break;
    }
  });

  const finalHistogram: BarDatum[] = [];
  Object.entries(histTimeMap).forEach((k) => {
    finalHistogram.push({
      timestamp: k[0],
      ...k[1],
    });
  });

  return finalHistogram;
};

export const isMessageHistogramEmpty = (
  hist: BarDatum[] | undefined
): boolean | undefined => {
  return hist?.every((d) => {
    return (
      d[MessageKeyEnum.BLOCKCHAIN] === 0 &&
      d[MessageKeyEnum.MESSAGES] === 0 &&
      d[MessageKeyEnum.TOKENS] === 0
    );
  });
};
