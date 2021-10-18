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

export const NODE_VALUE = 1;
export const IDENTITY_VALUE = 0.15;

export type DATUM = {
  id: string;
  children: {
    id: string;
    children: {
      id: string;
      value: number;
    }[];
  }[];
};

export const HARDCODED_DATA: DATUM = {
  id: 'network-map',
  children: [
    {
      id: 'ORG 1',
      children: [
        {
          id: 'node 1',
          value: NODE_VALUE,
        },
        {
          id: 'identity 1',
          value: IDENTITY_VALUE,
        },
      ],
    },
    {
      id: 'ORG 2',
      children: [
        {
          id: 'node',
          value: NODE_VALUE,
        },
        {
          id: 'node2',
          value: NODE_VALUE,
        },
        {
          id: 'node3',
          value: NODE_VALUE,
        },
        {
          id: '2id1',
          value: IDENTITY_VALUE,
        },
      ],
    },
    {
      id: 'ORG 3',
      children: [
        {
          id: '3node',
          value: NODE_VALUE,
        },
        {
          id: '3node2',
          value: NODE_VALUE,
        },
        {
          id: '3id1',
          value: IDENTITY_VALUE,
        },
      ],
    },
    {
      id: 'ORG 4',
      children: [
        {
          id: '4node',
          value: NODE_VALUE,
        },
        {
          id: '4id1',
          value: IDENTITY_VALUE,
        },
      ],
    },
    {
      id: 'ORG 5',
      children: [
        {
          id: '5node',
          value: NODE_VALUE,
        },
        {
          id: '5node2',
          value: NODE_VALUE,
        },
        {
          id: '5id1',
          value: IDENTITY_VALUE,
        },
      ],
    },
    {
      id: 'ORG 6',
      children: [
        {
          id: '6node',
          value: NODE_VALUE,
        },
        {
          id: '6node2',
          value: NODE_VALUE,
        },
        {
          id: '6id1',
          value: IDENTITY_VALUE,
        },
      ],
    },
    {
      id: 'ORG 7',
      children: [
        {
          id: '7node',
          value: NODE_VALUE,
        },
        {
          id: '7id1',
          value: IDENTITY_VALUE,
        },
        {
          id: '7id2',
          value: IDENTITY_VALUE,
        },
        {
          id: '7id3',
          value: IDENTITY_VALUE,
        },
      ],
    },
  ],
};
