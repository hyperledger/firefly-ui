// Copyright © 2021 Kaleido, Inc.
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
import { CreatedFilterOptions, ICreatedFilter } from './interfaces';

export const fetchWithCredentials = (
  resource: string,
  options?: RequestInit
): Promise<Response> => {
  return fetch(
    `${window.location.protocol}//${window.location.hostname}:${window.location.port}${resource}`,
    { ...options, credentials: 'include' }
  );
};

export const fetchCatcher = async (url: string): Promise<any> => {
  const response = await fetch(url);
  if (!response.ok) {
    console.log(`error fetching ${url}`);
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

// https://github.com/hyperledger/firefly/blob/04cd7184e0562a3a5a5344b0430bf68cc76415b1/internal/apiserver/restfilter.go#L126
export const filterOperators = [
  '=',
  '>',
  '>=',
  '<',
  '<=',
  '@',
  '^',
  '!',
  '!@',
  '!^',
];
