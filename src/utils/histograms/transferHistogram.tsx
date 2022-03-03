import { BarDatum } from '@nivo/bar';
import {
  IHistTransferTimeMap,
  IMetric,
  IMetricType,
  TransferKeyEnum,
} from '../../interfaces';

// Transfers
const processTransferHistBuckets = (
  buckets: IMetric[],
  eventKey: TransferKeyEnum,
  timeMap: IHistTransferTimeMap
): IHistTransferTimeMap => {
  buckets.map((b) => {
    // Timestamp has already been recorded
    if (timeMap[b.timestamp]) {
      timeMap[b.timestamp][eventKey] =
        timeMap[b.timestamp][eventKey] + +b.count;
    } else {
      // Timestamp not yet recorded
      timeMap[b.timestamp] = {
        [TransferKeyEnum.MINT]:
          eventKey === TransferKeyEnum.MINT ? +b.count : 0,
        [TransferKeyEnum.TRANSFER]:
          eventKey === TransferKeyEnum.TRANSFER ? +b.count : 0,
        [TransferKeyEnum.BURN]:
          eventKey === TransferKeyEnum.BURN ? +b.count : 0,
      };
    }
  });

  return timeMap;
};

export const makeTransferHistogram = (histList: IMetricType[]): BarDatum[] => {
  let histTimeMap: IHistTransferTimeMap = {};
  histList?.map((hist) => {
    switch (hist.type) {
      // Mint
      case TransferKeyEnum.MINT.toLowerCase():
        histTimeMap = processTransferHistBuckets(
          hist.buckets,
          TransferKeyEnum.MINT,
          histTimeMap
        );
        break;
      // Transfer
      case TransferKeyEnum.TRANSFER.toLowerCase():
        histTimeMap = processTransferHistBuckets(
          hist.buckets,
          TransferKeyEnum.TRANSFER,
          histTimeMap
        );
        break;
      // Burn
      case TransferKeyEnum.BURN.toLowerCase():
        histTimeMap = processTransferHistBuckets(
          hist.buckets,
          TransferKeyEnum.BURN,
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

export const isTransferHistogramEmpty = (
  hist: BarDatum[] | undefined
): boolean | undefined => {
  return hist?.every((d) => {
    return (
      d[TransferKeyEnum.MINT] === 0 &&
      d[TransferKeyEnum.TRANSFER] === 0 &&
      d[TransferKeyEnum.BURN] === 0
    );
  });
};
