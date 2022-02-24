import { BarDatum } from '@nivo/bar';
import {
  EventKeyEnum,
  FF_EVENTS,
  IHistEventTimeMap,
  IMetric,
  IMetricType,
} from '../interfaces';

const processHistBuckets = (
  buckets: IMetric[],
  eventKey: EventKeyEnum,
  timeMap: IHistEventTimeMap
): IHistEventTimeMap => {
  buckets.map((b) => {
    // Timestamp has already been recorded
    if (timeMap[b.timestamp]) {
      timeMap[b.timestamp][eventKey] =
        timeMap[b.timestamp][eventKey] + +b.count;
    } else {
      // Timestamp not yet recorded
      timeMap[b.timestamp] = {
        [EventKeyEnum.BLOCKCHAIN]:
          eventKey === EventKeyEnum.BLOCKCHAIN ? +b.count : 0,
        [EventKeyEnum.MESSAGES]:
          eventKey === EventKeyEnum.MESSAGES ? +b.count : 0,
        [EventKeyEnum.TOKENS]: eventKey === EventKeyEnum.TOKENS ? +b.count : 0,
      };
    }
  });

  return timeMap;
};

export const makeHistogramEventBuckets = (
  histList: IMetricType[]
): BarDatum[] => {
  let histTimeMap: IHistEventTimeMap = {};
  histList.map((hist) => {
    switch (hist.type) {
      // Message
      case FF_EVENTS.TX_SUBMITTED ||
        FF_EVENTS.MSG_CONFIRMED ||
        FF_EVENTS.MSG_REJECTED:
        histTimeMap = processHistBuckets(
          hist.buckets,
          EventKeyEnum.MESSAGES,
          histTimeMap
        );
        break;
      // Blockchain
      case FF_EVENTS.BLOCKCHAIN_EVENT ||
        FF_EVENTS.CONTRACT_API_CONFIRMED ||
        FF_EVENTS.CONTRACT_INTERFACE_CONFIRMED ||
        FF_EVENTS.DATATYPE_CONFIRMED ||
        FF_EVENTS.GROUP_CONFIRMED ||
        FF_EVENTS.NS_CONFIRMED ||
        FF_EVENTS.TOKEN_POOL_CONFIRMED:
        histTimeMap = processHistBuckets(
          hist.buckets,
          EventKeyEnum.BLOCKCHAIN,
          histTimeMap
        );
        break;
      // Tokens
      case FF_EVENTS.TOKEN_TRANSFER_CONFIRMED ||
        FF_EVENTS.TOKEN_TRANSFER_FAILED:
        histTimeMap = processHistBuckets(
          hist.buckets,
          EventKeyEnum.TOKENS,
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

export const isHistogramEmpty = (
  hist: BarDatum[] | undefined
): boolean | undefined => {
  return hist?.every((d) => {
    return (
      d[EventKeyEnum.BLOCKCHAIN] === 0 &&
      d[EventKeyEnum.MESSAGES] === 0 &&
      d[EventKeyEnum.TOKENS] === 0
    );
  });
};
