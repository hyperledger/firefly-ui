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

import { Chip, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { ITokenPool, ITokenTransfer } from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import { PoolStateColorMap, TransferIconMap } from '../../interfaces/enums';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { HashPopover } from '../Popovers/HashPopover';
import { DataTable } from '../Tables/Table';
import { DataTableEmptyState } from '../Tables/TableEmptyState';
import { IDataTableRecord } from '../Tables/TableInterfaces';
import { DisplaySlide } from './DisplaySlide';
import { DrawerListItem, IDataListItem } from './ListItem';

interface Props {
  pool: ITokenPool;
  open: boolean;
  onClose: () => void;
}

export const PoolSlide: React.FC<Props> = ({ pool, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);

  const [recentTransfers, setRecentTransfers] = useState<ITokenTransfer[]>([]);

  useEffect(() => {
    // Recent transfers in pool
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}?pool=${pool.id}&limit=5`
    )
      .then((transfers: ITokenTransfer[]) => {
        setRecentTransfers(transfers);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [pool]);

  const dataList: IDataListItem[] = [
    {
      label: t('id'),
      value: pool.id,
      button: <FFCopyButton value={pool.id} />,
    },
    {
      label: t('protocolID'),
      value: pool.protocolId,
      button: <FFCopyButton value={pool.protocolId} />,
    },
    {
      label: t('connector'),
      value: pool.connector,
      button: <FFCopyButton value={pool.connector} />,
    },
    {
      label: t('transactionID'),
      value: pool.tx.id,
      button: <FFCopyButton value={pool.tx.id} />,
    },
    {
      label: t('messageID'),
      value: pool.message ?? t('noMessageInTransfer'),
      button: pool.message ? <FFCopyButton value={pool.message} /> : undefined,
    },
    {
      label: t('state'),
      value: pool.state && (
        <Chip
          label={pool.state.toUpperCase()}
          sx={{ backgroundColor: PoolStateColorMap[pool.state] }}
        ></Chip>
      ),
    },
    {
      label: t('timestamp'),
      value: dayjs(pool.created).format('MM/DD/YYYY h:mm A'),
    },
  ];

  const tokenTransferColHeaders = [
    t('txHash'),
    t('from'),
    t('to'),
    t('amount'),
    t('created'),
  ];
  const tokenTransferRecords = (): IDataTableRecord[] => {
    return recentTransfers.map((transfer) => {
      return {
        key: pool.id,
        columns: [
          {
            value: (
              <>
                <Grid container justifyContent="flex-start" alignItems="center">
                  {TransferIconMap[transfer.type]}
                  <Typography pl={DEFAULT_PADDING} variant="body2">
                    {transfer.type.toUpperCase()}
                  </Typography>
                </Grid>
              </>
            ),
          },
          {
            value: (
              <HashPopover
                shortHash={true}
                address={transfer.from ?? t('nullAddress')}
              ></HashPopover>
            ),
          },
          {
            value: (
              <HashPopover
                shortHash={true}
                address={transfer.to ?? t('nullAddress')}
              ></HashPopover>
            ),
          },
          {
            value: <Typography>{transfer.amount}</Typography>,
          },
          { value: dayjs(pool.created).format('MM/DD/YYYY h:mm A') },
        ],
      };
    });
  };

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <Grid item pb={5}>
            <Typography variant="subtitle1">{`${
              pool.standard
            } - ${pool.type.toLocaleUpperCase()}`}</Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                fontSize: '14',
                textTransform: 'uppercase',
              }}
            >
              {pool.name}
            </Typography>
          </Grid>
          {/* Data list */}
          <Grid container item>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Recent transfers table */}
          {!recentTransfers ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : recentTransfers.length ? (
            <DataTable
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={tokenTransferRecords()}
              columnHeaders={tokenTransferColHeaders}
            />
          ) : (
            <DataTableEmptyState
              message={t('noTokenTransfersInPool')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
