// Copyright © 2022 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import dayjs from 'dayjs';
import { CreatedFilterOptions, ICreatedFilter } from './_core/interfaces';

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
    return response.json();
  }
};

export const getCreatedFilter = (
  createdFilter: CreatedFilterOptions
): ICreatedFilter => {
  let createdFilterTime: number;

  switch (createdFilter) {
    case '1hour':
      createdFilterTime = dayjs().subtract(1, 'hour').unix();
      break;
    case '24hours':
      createdFilterTime = dayjs().subtract(24, 'hours').unix();
      break;
    case '7days':
      createdFilterTime = dayjs().subtract(7, 'days').unix();
      break;
    case '30days':
      createdFilterTime = dayjs().subtract(30, 'days').unix();
      break;
    default:
      createdFilterTime = dayjs().subtract(24, 'hours').unix();
      break;
  }
  return {
    filterTime: createdFilterTime,
    filterString: `&created=>=${createdFilterTime}`,
  };
};

export const getShortHash = (hash: string): string => {
  return hash.length >= 10 ? `${hash.slice(0, 5)}...${hash.slice(-5)}` : '';
};

export const jsNumberForAddress = (address: string): number => {
  const addr = address.slice(2, 10);
  const seed = parseInt(addr, 16);
  return seed;
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
