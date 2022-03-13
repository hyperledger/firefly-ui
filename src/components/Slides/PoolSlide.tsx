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
import { Chip, Grid, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  IPagedTokenTransferResponse,
  ITokenPool,
  ITokenTransfer,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import {
  FF_TRANSFER_CATEGORY_MAP,
  PoolStateColorMap,
  TransferIconMap,
} from '../../interfaces/enums';
import { DEFAULT_PADDING } from '../../theme';
import { fetchCatcher } from '../../utils';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FF_NAV_PATHS } from '../Navigation/Paths';
import { HashPopover } from '../Popovers/HashPopover';
import { DataTable } from '../Tables/Table';
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
  const navigate = useNavigate();
  const [recentTransfers, setRecentTransfers] = useState<ITokenTransfer[]>([]);

  useEffect(() => {
    // Recent transfers in pool
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}?limit=5`
    )
      .then((transfers: IPagedTokenTransferResponse) => {
        setRecentTransfers(transfers.items);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace]);

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
          label={pool.state.toLocaleUpperCase()}
          sx={{ backgroundColor: PoolStateColorMap[pool.state] }}
        ></Chip>
      ),
    },
    {
      label: t('created'),
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
  const tokenTransferRecords: IDataTableRecord[] = recentTransfers.map(
    (transfer) => {
      return {
        key: pool.id,
        columns: [
          {
            value: (
              <>
                <Grid
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  container
                >
                  <Grid container item justifyContent="flex-start" xs={1}>
                    {TransferIconMap[transfer.type]}
                  </Grid>
                  <Grid container item justifyContent="flex-end" xs={11}>
                    <Typography sx={{ fontSize: '14px' }}>
                      {t(FF_TRANSFER_CATEGORY_MAP[transfer.type].nicename)}
                    </Typography>
                  </Grid>
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
        leftBorderColor: FF_TRANSFER_CATEGORY_MAP[transfer.type].color,
      };
    }
  );

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <Grid item pb={DEFAULT_PADDING}>
            <Typography variant="subtitle1">{`${
              pool.standard
            } - ${pool.type.toLocaleUpperCase()}`}</Typography>
            <Grid
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              container
              pt={DEFAULT_PADDING}
            >
              <Grid container item justifyContent="flex-start" xs={1}>
                <Jazzicon diameter={34} seed={jsNumberForAddress(pool.name)} />
              </Grid>
              <Grid container item justifyContent="flex-start" xs={11}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '14',
                  }}
                >
                  {pool.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Data list */}
          <Grid container item pb={DEFAULT_PADDING}>
            {dataList.map((data, idx) => (
              <DrawerListItem key={idx} item={data} />
            ))}
          </Grid>
          {/* Recent transfers table */}
          <DataTable
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={tokenTransferRecords}
            columnHeaders={tokenTransferColHeaders}
            emptyStateText={t('noTokenTransfersInPool')}
            header={t('recentTokenTransfers')}
            headerBtn={
              <IconButton
                onClick={() =>
                  navigate(FF_NAV_PATHS.tokensTransfersPath(selectedNamespace))
                }
              >
                <ArrowForwardIcon />
              </IconButton>
            }
          />
        </Grid>
      </DisplaySlide>
    </>
  );
};
