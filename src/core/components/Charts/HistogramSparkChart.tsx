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

import { BarDatum, ResponsiveBar } from '@nivo/bar';
import React from 'react';
import { IMetric } from '../../interfaces';

interface Props {
  colors: string[];
  data: BarDatum[] | IMetric[];
  indexBy: string;
  keys: string[];
}

export const HistogramSparkChart: React.FC<Props> = ({
  colors,
  data,
  indexBy,
  keys,
}) => {
  return (
    <ResponsiveBar
      data={data as BarDatum[]}
      colors={colors}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      padding={0.35}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      theme={{
        background: 'transparent',
        grid: {
          line: {
            stroke: 'transparent',
          },
        },
      }}
      tooltip={() => <div></div>}
      labelSkipWidth={100}
      labelSkipHeight={100}
      labelTextColor={'#e32b2b'}
      role="application"
    />
  );
};
