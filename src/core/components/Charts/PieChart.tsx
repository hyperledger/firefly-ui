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

import { Theme, useMediaQuery, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { PieCustomLayer, PieLayer, ResponsivePie } from '@nivo/pie';
import React from 'react';
import { IGenericPagedResponse, IPieChartElement } from '../../interfaces';

export const mapPieChartData = (
  data: IGenericPagedResponse[],
  colorMap: { [key: string]: string },
  enumMap: { [key: string]: string }
): IPieChartElement[] => {
  const pieChartData: IPieChartElement[] = [];

  if (data.length === 0) return [];

  Object.keys(enumMap).forEach((e, idx) => {
    pieChartData.push({
      id: e,
      label: e,
      value: data[idx].total,
      color: colorMap[enumMap[e]],
    });
  });

  return pieChartData;
};

interface Props {
  data: IPieChartElement[];
  dataType: string;
}

const BASE_LAYERS: PieLayer<IPieChartElement>[] = [
  'arcs',
  'arcLinkLabels',
  'legends',
];

export const PieChart: React.FC<Props> = ({ data, dataType }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('lg'));

  const CenteredMetric: PieCustomLayer<IPieChartElement> = ({
    dataWithArc,
    centerX,
    centerY,
  }) => {
    let total = 0;
    dataWithArc.forEach((datum) => {
      total += datum.value;
    });

    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: '#FFFFFF',
          fontSize: '1.5em',
        }}
      >
        {total}&nbsp;{dataType}
      </text>
    );
  };

  return (
    <>
      <div className={classes.responsiveParent}>
        <div className={classes.responsiveChartWrapper}>
          <ResponsivePie
            data={data}
            margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
            innerRadius={0.8}
            padAngle={0.7}
            cornerRadius={3}
            // labels of placeholder values will not be shown
            arcLinkLabelsSkipAngle={1}
            colors={{ datum: 'data.color' }}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            enableArcLabels={false}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsTextColor="#9BA7B0"
            arcLinkLabel={(d) => `${d.id}: ${d.value}`}
            // change tooltip text color
            theme={{ tooltip: { container: { color: '#000000' } } }}
            legends={undefined}
            layers={isSmall ? BASE_LAYERS : [...BASE_LAYERS, CenteredMetric]}
          />
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  responsiveParent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  responsiveChartWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));
