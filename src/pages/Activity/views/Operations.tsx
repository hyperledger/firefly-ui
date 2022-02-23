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

import { Button, Chip, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { ChartHeader } from '../../../components/Charts/Header';
import { Histogram } from '../../../components/Charts/Histogram';
import { DataTable } from '../../../components/Tables/Table';
import { DataTableEmptyState } from '../../../components/Tables/TableEmptyState';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { Header } from '../../../components/Header';
import { DEFAULT_PADDING, FFColors } from '../../../theme';

export const ActivityOperations: () => JSX.Element = () => {
  const legend = [
    {
      color: FFColors.Yellow,
      title: 'Blockchain',
    },
    {
      color: FFColors.Orange,
      title: 'Tokens',
    },
    {
      color: FFColors.Pink,
      title: 'Messages',
    },
  ];

  const columnHeaders = [
    'Timestamp',
    'Activity',
    'Blockchain',
    'Author',
    'Details',
    '',
  ];

  const records: IDataTableRecord[] = [].map(() => ({
    key: 'key',
    columns: [
      {
        value: (
          <Typography>
            {dayjs(new Date()).format('MM/DD/YYYY h:mm A')}
          </Typography>
        ),
      },
      {
        value: <Typography>Token transfer complete</Typography>,
      },
      {
        value: <Typography>d521b...4d1a15</Typography>,
      },
      {
        value: <Typography>Member Name</Typography>,
      },
      {
        value: <Typography>From=0xabc To=0xbcd</Typography>,
      },
      {
        value: <Chip color="success" label="Success"></Chip>,
      },
    ],
  }));

  return (
    <>
      <Header title={'Operations'} subtitle={'Activity'}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title="All Events"
            legend={legend}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 10 }}>
                  Filter
                </Typography>
              </Button>
            }
          />
          {/* <Histogram data="undefined"></Histogram> */}
          {records.length ? (
            <DataTable
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              columnHeaders={columnHeaders}
              records={records}
              // {...{ pagination }}
            ></DataTable>
          ) : (
            <DataTableEmptyState
              header="No Transactions"
              message="No Messages to Display"
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};
