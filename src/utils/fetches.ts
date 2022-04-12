import { Dispatch, SetStateAction } from 'react';
import { ITokenPool } from '../interfaces';

export const fetchWithCredentials = (
  resource: string,
  options?: RequestInit
): Promise<Response> => {
  return fetch(
    `${window.location.protocol}//${window.location.hostname}:${window.location.port}${resource}`,
    { ...options, credentials: 'include' }
  );
};

export const fetchCatcher = async (resource: string): Promise<any> => {
  const response = await fetchWithCredentials(resource);
  if (!response.ok) {
    console.log(`error fetching ${resource}`);
  } else {
    return await response.json();
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
    `/api/v1/namespaces/${namespace}/tokens/pools/${id}`
  );
  if (!response.ok) {
    return undefined;
  }
  const pool: ITokenPool = await response.json();
  setPoolCache((poolCache) => new Map(poolCache.set(pool.id, pool)));
  return pool;
};
