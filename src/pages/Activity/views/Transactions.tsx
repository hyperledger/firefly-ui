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

import { Grid, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TxButton } from '../../../components/Buttons/TxButton';
import { Histogram } from '../../../components/Charts/Histogram';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  ICreatedFilter,
  IDataTableRecord,
  IMetric,
  IPagedTransactionResponse,
  ITransaction,
  TransactionFilters,
} from '../../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getCreatedFilter } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeTxHistogram } from '../../../utils/histograms/transactionHistogram';

export const ActivityTransactions: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const {
    filterAnchor,
    setFilterAnchor,
    activeFilters,
    setActiveFilters,
    filterString,
  } = useContext(FilterContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Transactions
  const [txs, setTxs] = useState<ITransaction[]>();
  // Transaction totals
  const [txTotal, setTxTotal] = useState(0);
  // View transaction slide out
  const [viewTx, setViewTx] = useState<ITransaction | undefined>();
  // Tx types histogram
  const [txHistData, setTxHistData] = useState<BarDatum[]>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Transactions
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.transactions
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }${filterString !== undefined ? filterString : ''}`
    )
      .then((txRes: IPagedTransactionResponse) => {
        setTxs(txRes.items);
        setTxTotal(txRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    createdFilter,
    lastEvent,
    filterString,
    reportFetchError,
  ]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Transactions,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Large
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setTxHistData(makeTxHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const txColumnHeaders = [
    t('type'),
    t('id'),
    t('details'),
    t('blockchainIds'),
    t('created'),
  ];

  const txRecords: IDataTableRecord[] | undefined = txs?.map((tx) => ({
    key: tx.id,
    columns: [
      {
        value: (
          <Typography>{t(FF_TX_CATEGORY_MAP[tx.type].nicename)}</Typography>
        ),
      },
      {
        value: <HashPopover shortHash={true} address={tx.id}></HashPopover>,
      },
      {
        value: 'TODO',
      },
      {
        value: (
          <>
            {tx.blockchainIds?.map((bid, idx) => (
              <HashPopover
                key={idx}
                shortHash={true}
                address={bid}
              ></HashPopover>
            ))}
          </>
        ),
      },
      { value: dayjs(tx.created).format('MM/DD/YYYY h:mm A') },
      { value: <TxButton ns={selectedNamespace} txID={tx.id} /> },
    ],
    onClick: () => setViewTx(tx),
    leftBorderColor: FF_TX_CATEGORY_MAP[tx.type].color,
  }));

  return (
    <>
      <Header title={t('transactions')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allTransactions')}
            filter={
              <FilterButton
                filters={activeFilters}
                setFilters={setActiveFilters}
                onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setFilterAnchor(e.currentTarget)
                }
              />
            }
          />
          <Histogram
            colors={makeColorArray(FF_TX_CATEGORY_MAP)}
            data={txHistData}
            indexBy="timestamp"
            keys={makeKeyArray(FF_TX_CATEGORY_MAP)}
            includeLegend={true}
            emptyText={t('noTransactions')}
            isEmpty={isHistogramEmpty(txHistData ?? [])}
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
            records={txRecords}
            columnHeaders={txColumnHeaders}
            paginate={true}
            emptyStateText={t('noTransactionsToDisplay')}
            dataTotal={txTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
          />
        </Grid>
      </Grid>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={TransactionFilters}
          addFilter={(filter: string) =>
            setActiveFilters((activeFilters) => [...activeFilters, filter])
          }
        />
      )}
      {viewTx && (
        <TransactionSlide
          transaction={viewTx}
          open={!!viewTx}
          onClose={() => {
            setViewTx(undefined);
          }}
        />
      )}
    </>
  );
};
