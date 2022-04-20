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

import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Histogram } from '../../../components/Charts/Histogram';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { TransferSlide } from '../../../components/Slides/TransferSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  IDataTableRecord,
  IMetric,
  IPagedTokenTransferResponse,
  ITokenTransfer,
  TransferFilters,
} from '../../../interfaces';
import {
  FF_TRANSFER_CATEGORY_MAP,
  TransferIconMap,
} from '../../../interfaces/enums';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeTransferHistogram } from '../../../utils/histograms/transferHistogram';
import { hasTransferEvent } from '../../../utils/wsEvents';

export const TokensTransfers: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  // Token transfers
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>();
  // Token Transfer totals
  const [tokenTransferTotal, setTokenTransferTotal] = useState(0);
  // Transfer types histogram
  const [transferHistData, setTransferHistData] = useState<BarDatum[]>();
  // View transfer slide out
  const [viewTransfer, setViewTransfer] = useState<
    ITokenTransfer | undefined
  >();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);
  const [isHistLoading, setIsHistLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    isMounted &&
      slideID &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransferById(
          slideID
        )}`
      )
        .then((transferRes: ITokenTransfer) => {
          setViewTransfer(transferRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Token transfers
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenTransfers
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
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
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    dateFilter,
    filterString,
    lastRefreshTime,
    isMounted,
  ]);

  // Histogram
  useEffect(() => {
    setIsHistLoading(true);
    const currentTime = dayjs().unix();
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
          BucketCollectionEnum.TokenTransfers,
          dateFilter.filterTime,
          currentTime,
          BucketCountEnum.Large
        )}`
      )
        .then((histTypes: IMetric[]) => {
          isMounted && setTransferHistData(makeTransferHistogram(histTypes));
        })
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => setIsHistLoading(false));
  }, [selectedNamespace, dateFilter, lastRefreshTime, isMounted]);

  const tokenTransferColHeaders = [
    t('activity'),
    t('from'),
    t('to'),
    t('amount'),
    t('protocolID'),
    t('signingKey'),
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
          value: <HashPopover address={transfer.protocolId}></HashPopover>,
        },
        {
          value: (
            <HashPopover shortHash={true} address={transfer.key}></HashPopover>
          ),
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(transfer.created)} />
          ),
        },
      ],
      onClick: () => {
        setViewTransfer(transfer);
        setSlideSearchParam(transfer.localId);
      },
      leftBorderColor: FF_TRANSFER_CATEGORY_MAP[transfer.type]?.color,
    }));

  return (
    <>
      <Header
        title={t('transfers')}
        subtitle={t('tokens')}
        showRefreshBtn={hasTransferEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <FFPageLayout>
        <Histogram
          colors={makeColorArray(FF_TRANSFER_CATEGORY_MAP)}
          data={transferHistData}
          indexBy="timestamp"
          keys={makeKeyArray(FF_TRANSFER_CATEGORY_MAP)}
          includeLegend={true}
          emptyText={t('noTransfers')}
          isLoading={isHistLoading}
          isEmpty={isHistogramEmpty(transferHistData ?? [])}
          filterButton={
            <FilterButton
              onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                setFilterAnchor(e.currentTarget)
              }
            />
          }
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
      </FFPageLayout>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={TransferFilters}
        />
      )}
      {viewTransfer && (
        <TransferSlide
          transfer={viewTransfer}
          open={!!viewTransfer}
          onClose={() => {
            setViewTransfer(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
