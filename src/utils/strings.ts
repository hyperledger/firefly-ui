// Copyright © 2022 Kaleido, Inc.

import i18next from 'i18next';
import { IBlockchainCategory } from '../interfaces';

export const getShortHash = (hash: string): string => {
  return hash?.length >= 10 ? `${hash.slice(0, 5)}...${hash.slice(-5)}` : hash;
};

export const jsNumberForAddress = (address: string): number => {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
};

export const makeMultipleQueryParams = (
  map: { [key: string]: IBlockchainCategory },
  key: string,
  queryKey: string
) => {
  const str = Object.keys(map)
    .filter((k) => map[k]?.category === key)
    .toString();
  return `&${queryKey}=${str.replaceAll(',', `&${queryKey}=`)}`;
};

export const addDecToAmount = (amount: string, decimals: number) => {
  // Pad amount with (decimals) amount of '0's on the left hand side
  let decAmount = amount.padStart(decimals + 1, '0');
  // Add decimal to correct spot
  decAmount =
    decAmount.slice(0, decAmount.length - decimals) +
    '.' +
    decAmount.slice(decAmount.length - decimals);
  // Remove trailing 0s
  decAmount = decAmount.replace(/\.?0*$/, '');

  return decAmount;
};

export const getBalanceTooltip = (amount: string, decimals: number) => {
  return `${i18next.t('amount')}: ${amount}, ${i18next.t(
    'decimals'
  )}: ${decimals}`;
};
