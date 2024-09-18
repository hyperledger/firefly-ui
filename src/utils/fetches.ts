import { Dispatch, SetStateAction } from 'react';
import {
  FF_Paths,
  ITokenApproval,
  ITokenApprovalWithPoolName,
  ITokenBalance,
  ITokenBalanceWithPool,
  ITokenPool,
  ITokenTransfer,
  ITokenTransferWithPool,
} from '../interfaces';

import { parse, isSafeNumber, LosslessNumber } from 'lossless-json';

export const fetchWithCredentials = (
  resource: string,
  options?: RequestInit
): Promise<Response> => {
  return fetch(
    `${window.location.protocol}//${window.location.hostname}:${window.location.port}${resource}`,
    { ...options, credentials: 'include' }
  );
};

export function parseLargeNumbersAsStrings(value: any) {
  return isSafeNumber(value, { approx: false })
    ? parseFloat(value) // Smaller numbers are kept as Javascript numbers
    : new LosslessNumber(value).toString(); // Large numbers are safely stringified
}

export const fetchCatcher = async (resource: string): Promise<any> => {
  const response = await fetchWithCredentials(resource);
  if (!response.ok) {
  } else {
    const responseText = await response.text();
    const responseJSONLargeNumbersStringified = parse(
      responseText,
      null,
      parseLargeNumbersAsStrings
    );
    return responseJSONLargeNumbersStringified;
  }
};

export const summarizeFetchError = async (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  errOrResponse: any
): Promise<string> => {
  console.log('Fetch error', errOrResponse);
  let message = 'Fetch failed';
  if (errOrResponse.status) {
    message += ` [${errOrResponse.status}]`;
  }
  if (errOrResponse.message) {
    message += `: ${errOrResponse.message}`;
  }
  if (typeof errOrResponse.json === 'function') {
    let jsonData: any;
    try {
      jsonData = await errOrResponse.json();
    } catch (err1) {
      console.log('Failed to parse response as JSON: ' + err1);
    }
    if (jsonData?.error) {
      message += `: ${jsonData.error}`;
    } else {
      try {
        message += `: ${await errOrResponse.text()}`;
      } catch (err2) {
        console.log('Failed to get response as text: ' + err2);
      }
    }
  }
  return message;
};

export const fetchPool = async (
  namespace: string,
  id: string,
  poolCache: Map<string, ITokenPool>,
  setPoolCache: Dispatch<SetStateAction<Map<string, ITokenPool>>>
): Promise<ITokenPool | undefined> => {
  if (poolCache.has(id)) {
    return poolCache.get(id);
  }
  const response = await fetchWithCredentials(
    `${FF_Paths.nsPrefix}/${namespace}${FF_Paths.tokenPools}/${id}`
  );
  if (!response.ok) {
    return undefined;
  }
  const pool: ITokenPool = await response.json();
  setPoolCache((poolCache) => new Map(poolCache.set(pool.id, pool)));
  return pool;
};

export const fetchPoolObjectFromTransfer = async (
  transfer: ITokenTransfer,
  ns: string,
  poolCache: Map<string, ITokenPool>,
  setPoolCache: Dispatch<SetStateAction<Map<string, ITokenPool>>>
): Promise<ITokenTransferWithPool> => {
  const pool = await fetchPool(ns, transfer.pool, poolCache, setPoolCache);
  return {
    ...transfer,
    poolObject: pool,
  };
};

export const fetchPoolObjectFromBalance = async (
  balance: ITokenBalance,
  ns: string,
  poolCache: Map<string, ITokenPool>,
  setPoolCache: Dispatch<SetStateAction<Map<string, ITokenPool>>>
): Promise<ITokenBalanceWithPool> => {
  const pool = await fetchPool(ns, balance.pool, poolCache, setPoolCache);
  return {
    ...balance,
    poolObject: pool,
  };
};

export const fetchPoolNameFromApproval = async (
  approval: ITokenApproval,
  ns: string,
  poolCache: Map<string, ITokenPool>,
  setPoolCache: Dispatch<SetStateAction<Map<string, ITokenPool>>>
): Promise<ITokenApprovalWithPoolName> => {
  const pool = await fetchPool(ns, approval.pool, poolCache, setPoolCache);
  return {
    ...approval,
    poolName: pool ? pool.name : approval.pool,
  };
};
