import { BarDatum } from '@nivo/bar';
import { IBlockchainCategory } from '../interfaces';

export const isHistogramEmpty = (hist: BarDatum[]): boolean => {
  let isEmpty = true;
  if (hist.length) {
    hist.map((d) => {
      Object.keys(d).map((k) => {
        if (k !== 'timestamp' && d[k] !== 0) {
          isEmpty = false;
        }
      });
    });
  }
  return isEmpty;
};

export const makeColorArray = (map: { [key: string]: IBlockchainCategory }) => {
  return Array.from(new Set(Object.keys(map).map((k) => map[k]?.color)));
};

export const makeKeyArray = (map: { [key: string]: IBlockchainCategory }) => {
  return Array.from(new Set(Object.keys(map).map((k) => map[k]?.category)));
};
