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

import {
  Box,
  Button,
  Chip,
  Grid,
  TablePagination,
  Typography,
} from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardEmptyState } from '../../../components/Cards/CardEmptyState';
import { ChartHeader } from '../../../components/Charts/Header';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { DataTable } from '../../../components/Tables/Table';
import { DataTableEmptyState } from '../../../components/Tables/TableEmptyState';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  EventKeyEnum,
  FF_Paths,
  ICreatedFilter,
  IMetricType,
  IPagedTransactionResponse,
  ITransaction,
} from '../../../interfaces';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import {
  fetchCatcher,
  isEventHistogramEmpty,
  makeEventHistogram,
} from '../../../utils';

const PAGE_LIMITS = [10, 25];

export const ActivityTransactions: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Transactions
  const [txs, setTxs] = useState<ITransaction[]>();
  // Transaction totals
  const [txTotal, setTxTotal] = useState(0);
  // View transaction slide out
  const [viewTx, setViewTx] = useState<ITransaction | undefined>();
  // Event types histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (newPage > currentPage && rowsPerPage * (currentPage + 1) >= txTotal) {
      return;
    }
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPage(0);
    setRowsPerPage(+event.target.value);
  };

  const pagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={currentPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      sx={{ color: 'text.secondary' }}
    />
  );

  // Transactions
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.transactions
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((txRes: IPagedTransactionResponse) => {
        setTxs(txRes.items);
        setTxTotal(txRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Events
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=${BucketCountEnum.Large}`
    )
      .then((histTypes: IMetricType[]) => {
        setEventHistData(makeEventHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const txColumnHeaders = [
    t('type'),
    t('transactionID'),
    t('details'),
    t('created'),
    t('status'),
  ];

  const txRecords: IDataTableRecord[] | undefined = txs?.map((tx) => ({
    key: tx.id,
    columns: [
      {
        value: <Typography>{tx.type.toLocaleUpperCase()}</Typography>,
      },
      {
        value: <HashPopover shortHash={true} address={tx.id}></HashPopover>,
      },
      {
        value: <Typography>TODO</Typography>,
      },
      { value: dayjs(tx.created).format('MM/DD/YYYY h:mm A') },
      {
        value: <Chip color="success" label="TODO"></Chip>,
      },
    ],
    onClick: () => setViewTx(tx),
  }));

  return (
    <>
      <Header title={t('transactions')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title={t('allTransactions')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <Box
            mt={1}
            pb={2}
            borderRadius={1}
            sx={{
              width: '100%',
              height: 200,
              backgroundColor: 'background.paper',
            }}
          >
            {!eventHistData ? (
              <FFCircleLoader height={200} color="warning"></FFCircleLoader>
            ) : isEventHistogramEmpty(eventHistData) ? (
              <CardEmptyState
                height={200}
                text={t('noTransactions')}
              ></CardEmptyState>
            ) : (
              <Histogram
                colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
                data={eventHistData}
                indexBy="timestamp"
                keys={[
                  EventKeyEnum.BLOCKCHAIN,
                  EventKeyEnum.MESSAGES,
                  EventKeyEnum.TOKENS,
                ]}
                includeLegend={true}
              ></Histogram>
            )}
          </Box>
          {!txs ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : txs.length ? (
            <DataTable
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={txRecords}
              columnHeaders={txColumnHeaders}
              {...{ pagination }}
            />
          ) : (
            <DataTableEmptyState
              message={t('noTransactionsToDisplay')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </Grid>
      {viewTx && (
        <TransactionSlide
          txID={viewTx.id}
          open={!!viewTx}
          onClose={() => {
            setViewTx(undefined);
          }}
        />
      )}
    </>
  );
};
