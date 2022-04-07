import { BarDatum } from '@nivo/bar';
import { IMetric } from '../../interfaces';
import {
  BlockchainEventCategoryEnum,
  IHistBlockchainEventTimeMap,
} from '../../interfaces/enums/blockchainEventTypes';

export const makeBlockchainEventHistogram = (
  histList: IMetric[]
): BarDatum[] => {
  const timeMap: IHistBlockchainEventTimeMap = {};
  histList.map((hist) => {
    timeMap[hist.timestamp] = {
      [BlockchainEventCategoryEnum.BLOCKCHAINEVENT]: 0,
      isCapped: 0,
    };
    timeMap[hist.timestamp][BlockchainEventCategoryEnum.BLOCKCHAINEVENT] =
      timeMap[hist.timestamp][BlockchainEventCategoryEnum.BLOCKCHAINEVENT] +
      +hist.count;
    hist.isCapped && (timeMap[hist.timestamp].isCapped = 1);
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
