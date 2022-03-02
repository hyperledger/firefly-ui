import { BarDatum } from '@nivo/bar';
import {
  FF_OPERATIONS,
  IHistOperationTimeMap,
  IMetric,
  IMetricType,
  OperationKeyEnum,
} from '../../interfaces';

// Operations
const processOperationBuckets = (
  buckets: IMetric[],
  opKey: OperationKeyEnum,
  timeMap: IHistOperationTimeMap
): IHistOperationTimeMap => {
  buckets.map((b) => {
    // Timestamp has already been recorded
    if (timeMap[b.timestamp]) {
      timeMap[b.timestamp][opKey] = timeMap[b.timestamp][opKey] + +b.count;
    } else {
      // Timestamp not yet recorded
      timeMap[b.timestamp] = {
        [OperationKeyEnum.BLOCKCHAIN]:
          opKey === OperationKeyEnum.BLOCKCHAIN ? +b.count : 0,
        [OperationKeyEnum.MESSAGES]:
          opKey === OperationKeyEnum.MESSAGES ? +b.count : 0,
        [OperationKeyEnum.TOKENS]:
          opKey === OperationKeyEnum.TOKENS ? +b.count : 0,
      };
    }
  });

  return timeMap;
};

export const makeOperationHistogram = (histList: IMetricType[]): BarDatum[] => {
  let histTimeMap: IHistOperationTimeMap = {};
  histList.map((hist) => {
    switch (hist.type) {
      // Message
      case FF_OPERATIONS.PS_BATCH_BROADCAST ||
        FF_OPERATIONS.DX_BATCH_SEND ||
        FF_OPERATIONS.DX_BLOB_SEND:
        histTimeMap = processOperationBuckets(
          hist.buckets,
          OperationKeyEnum.MESSAGES,
          histTimeMap
        );
        break;
      // Blockchain
      case FF_OPERATIONS.BLOCKCHAIN_BATCH_PIN ||
        FF_OPERATIONS.BLOCKCHAIN_INVOKE:
        histTimeMap = processOperationBuckets(
          hist.buckets,
          OperationKeyEnum.BLOCKCHAIN,
          histTimeMap
        );
        break;
      // Tokens
      case FF_OPERATIONS.TOKEN_CREATE_POOL ||
        FF_OPERATIONS.TOKEN_ACTIVATE_POOL ||
        FF_OPERATIONS.TOKEN_TRANSFER:
        histTimeMap = processOperationBuckets(
          hist.buckets,
          OperationKeyEnum.TOKENS,
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

export const isOperationHistogramEmpty = (
  hist: BarDatum[] | undefined
): boolean | undefined => {
  return hist?.every((d) => {
    return (
      d[OperationKeyEnum.BLOCKCHAIN] === 0 &&
      d[OperationKeyEnum.MESSAGES] === 0 &&
      d[OperationKeyEnum.TOKENS] === 0
    );
  });
};
