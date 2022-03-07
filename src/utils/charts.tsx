import { BarDatum } from '@nivo/bar';

export const isHistogramEmpty = (
  hist: BarDatum[],
  categories: string[]
): boolean => {
  return !hist.length
    ? true
    : hist.every((d) => {
        let isEmpty = true;
        categories.map((k) => {
          isEmpty = d[k] === 0;
        });
        return isEmpty;
      });
};
