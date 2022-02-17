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

import { Paper, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import React from 'react';
import { IMetric } from '../../interfaces';

interface Props {
  colors: string[];
  data: BarDatum[] | IMetric[];
  indexBy: string;
  keys: string[];
  xAxisTitle: string;
  yAxisTitle: string;
}

export const Histogram: React.FC<Props> = ({
  colors,
  data,
  indexBy,
  keys,
  xAxisTitle,
  yAxisTitle,
}) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <ResponsiveBar
        data={data as BarDatum[]}
        colors={colors}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 10, right: 10, bottom: 10, left: 40 }}
        padding={0.25}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        axisBottom={{
          legend: xAxisTitle,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yAxisTitle,
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        theme={{
          background: 'transparent',
          axis: {
            ticks: {
              line: {
                stroke: '#555555',
              },
              text: {
                fill: '#aaaaaa',
              },
            },
            legend: {
              text: {
                fill: '#aaaaaa',
              },
            },
          },
          grid: {
            line: {
              stroke: '#555555',
            },
          },
        }}
        labelSkipWidth={100}
        labelSkipHeight={100}
        labelTextColor={'#ffffff'}
        role="application"
        tooltip={({ data }) => (
          <div
            style={{
              padding: 12,
              color: '#ffffff',
              background: '#222222',
            }}
          >
            <strong>
              {'Time'}: {dayjs(data.timestamp).format('MM/DD/YYYY h:mm A')}
              <br />
              {'Count'}: {data.count}
            </strong>
          </div>
        )}
      />
    </Paper>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(1),
  },
}));
