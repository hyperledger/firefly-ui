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

import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import {
  FF_NAV_PATHS,
  IDataTableRecord,
  IPagedTokenTransferResponse,
  ITokenBalance,
  ITokenPool,
  ITokenTransfer,
} from '../../interfaces';
import { FF_Paths } from '../../interfaces/constants';
import {
  FF_TRANSFER_CATEGORY_MAP,
  TransferIconMap,
} from '../../interfaces/enums';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../theme';
import { fetchCatcher, getFFTime, getShortHash } from '../../utils';
import { BalanceList } from '../Lists/BalanceList';
import { HashPopover } from '../Popovers/HashPopover';
import { FFTableText } from '../Tables/FFTableText';
import { DataTable } from '../Tables/Table';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';
import { SlideSectionHeader } from './SlideSectionHeader';

interface Props {
  balance: ITokenBalance;
  open: boolean;
  onClose: () => void;
}

export const BalanceSlide: React.FC<Props> = ({ balance, open, onClose }) => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);

  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>([]);
  const [tokenTransferTotal, setTokenTransferTotal] = useState(0);
  const [tokenPool, setTokenPool] = useState<ITokenPool>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[0]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    // Token Pool
    isMounted &&
      balance.pool &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPoolsById(
          balance.pool
        )}`
      )
        .then((poolRes: ITokenPool) => {
          isMounted && setTokenPool(poolRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [balance, isMounted]);

  // Token transfers
  useEffect(() => {
    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenTransfers
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}&key=${
          balance.key
        }&pool=${balance.pool}`
      )
        .then((tokenTransferRes: IPagedTokenTransferResponse) => {
          if (isMounted) {
            setTokenTransfers(tokenTransferRes.items);
            setTokenTransferTotal(tokenTransferRes.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [rowsPerPage, currentPage, selectedNamespace, isMounted]);

  const tokenTransferColHeaders = [
    t('activity'),
    t('from'),
    t('to'),
    t('amount'),
    t('timestamp'),
  ];
  const tokenTransferRecords: IDataTableRecord[] | undefined =
    tokenTransfers?.map((transfer) => ({
      key: transfer.localId,
      columns: [
        {
          value: (
            <FFTableText
              color="primary"
              text={t(FF_TRANSFER_CATEGORY_MAP[transfer.type]?.nicename)}
              icon={TransferIconMap[transfer.type]}
            />
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
          value: <FFTableText color="primary" text={transfer.amount} />,
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(transfer.created)} />
          ),
        },
      ],
      leftBorderColor: FF_TRANSFER_CATEGORY_MAP[transfer.type]?.color,
    }));

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Header */}
          <SlideHeader
            subtitle={t('balance')}
            title={getShortHash(balance.key)}
          />
          {/* Data list */}
          <Grid container item>
            <BalanceList balance={balance} pool={tokenPool} />
          </Grid>
          {/* Transfers */}
          {tokenTransfers && (
            <Grid container item wrap="nowrap" direction="column">
              <SlideSectionHeader
                clickPath={FF_NAV_PATHS.tokensTransfersPathByKeyAndPool(
                  selectedNamespace,
                  balance.key,
                  balance.pool
                )}
                title={t('recentTokenTransfers')}
              />
              <DataTable
                onHandleCurrPageChange={(currentPage: number) =>
                  setCurrentPage(currentPage)
                }
                onHandleRowsPerPage={(rowsPerPage: number) =>
                  setRowsPerPage(rowsPerPage)
                }
                stickyHeader={true}
                minHeight="300px"
                maxHeight="calc(100vh - 340px)"
                records={tokenTransferRecords}
                columnHeaders={tokenTransferColHeaders}
                paginate={true}
                emptyStateText={t('noTokenTransfersToDisplay')}
                dataTotal={tokenTransferTotal}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
              />
            </Grid>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
