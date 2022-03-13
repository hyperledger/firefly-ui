import { BarDatum } from '@nivo/bar';
import { IBlockchainCategory } from '../interfaces';

export const isHistogramEmpty = (
  hist: BarDatum[],
  categories: string[]
): boolean => {
  return hist.length
    ? hist.every((d) => {
        let isEmpty = true;
        Object.keys(categories).map((k) => {
          isEmpty = d[k] === 0;
        });
        return isEmpty;
      })
    : true;
};

export const makeColorArray = (map: { [key: string]: IBlockchainCategory }) => {
  return Array.from(new Set(Object.keys(map).map((k) => map[k].color)));
};

export const makeKeyArray = (map: { [key: string]: IBlockchainCategory }) => {
  return Array.from(new Set(Object.keys(map).map((k) => map[k].category)));
};
