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

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Chip, Grid, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { DisplaySlide } from '../../_core/components/Display/DisplaySlide';
import { DEFAULT_PADDING } from '../../theme';
import { DrawerListItem, IDataListItem } from './ListItem';
import { DrawerPanel, IOperationListItem } from './Panel';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const TransactionSlide: React.FC<Props> = ({ open, onClose }) => {
  // TODO: Remove mock data
  const dataList: IDataListItem[] = [
    {
      label: 'ID',
      value: '123456789876543212345678987654321',
      button: (
        <CopyToClipboard text={'todo'}>
          <IconButton>
            <ContentCopyIcon />
          </IconButton>
        </CopyToClipboard>
      ),
    },
    {
      label: 'Type',
      value: 'Batch Pin',
    },
    {
      label: 'Status',
      value: <Chip label="Success" color="success"></Chip>,
    },
    {
      label: 'Operations',
      value: '2',
    },
    {
      label: 'Timestamp',
      value: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
    },
  ];
  // TODO: Remove mock data
  const operationsList: IOperationListItem[] = [
    {
      label: 'Public_Storage_Batch_Broadcast',
      value: '123456789876543212345678987654321',
      badge: <Chip label="Success" color="success" size="small"></Chip>,
      button: (
        <IconButton>
          <ArrowForwardIcon />
        </IconButton>
      ),
    },
    {
      label: 'Public_Storage_Batch_Broadcast',
      value: '123456789876543212345678987654321',
      badge: <Chip label="Success" color="success" size="small"></Chip>,
      button: (
        <IconButton>
          <ArrowForwardIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Data */}
          <Grid item pb={5}>
            <Typography variant="subtitle1">Transaction</Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: '14',
              }}
            >
              [Transaction Type]
            </Typography>
          </Grid>
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Operations */}
          <Grid item py={5}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              Operations
            </Typography>
          </Grid>
          <Grid container item>
            {operationsList.map((op, idx) => (
              <DrawerPanel key={idx} item={op} />
            ))}
          </Grid>
          {/* Blockchain Events */}
          <Grid item py={5}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                fontSize: '12',
              }}
            >
              Blockchain Events
            </Typography>
          </Grid>
          <Grid container item>
            {operationsList.map((op, idx) => (
              <DrawerPanel key={idx} item={op} />
            ))}
          </Grid>
        </Grid>
      </DisplaySlide>
    </>
  );
};
