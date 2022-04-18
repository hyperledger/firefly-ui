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

import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadJsonButton } from '../../../components/Buttons/DownloadJsonButton';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { BatchSlide } from '../../../components/Slides/BatchSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BatchFilters,
  FF_Paths,
  IBatch,
  IDataTableRecord,
  IPagedBatchResponse,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import { hasDataEvent } from '../../../utils/wsEvents';

export const OffChainBatches: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  // Batches
  const [batches, setBatches] = useState<IBatch[]>();
  // Batch total
  const [batchTotal, setBatchTotal] = useState(0);
  const [viewBatch, setViewBatch] = useState<IBatch | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

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
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.batchesByBatchId(
          slideID
        )}`
      )
        .then((batchRes: IBatch) => {
          setViewBatch(batchRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Batch
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.batches
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((batchRes: IPagedBatchResponse) => {
          if (isMounted) {
            setBatches(batchRes.items);
            setBatchTotal(batchRes.total);
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

  const batchColHeaders = [
    t('id'),
    t('type'),
    t('hash'),
    t('node'),
    t('group'),
    t('author'),
    t('signingKey'),
    t('created'),
    t('manifest'),
  ];

  const batchRecords: IDataTableRecord[] | undefined = batches?.map(
    (batch) => ({
      key: batch.id,
      columns: [
        {
          value: <HashPopover shortHash address={batch.id}></HashPopover>,
        },
        {
          value: <FFTableText color="primary" text={batch.type} />,
        },
        {
          value: <HashPopover shortHash address={batch.hash}></HashPopover>,
        },
        {
          value: batch.node ? (
            <HashPopover shortHash address={batch.node}></HashPopover>
          ) : (
            <FFTableText color="secondary" text={t('noNode')} />
          ),
        },
        {
          value: batch.group ? (
            <HashPopover shortHash address={batch.group}></HashPopover>
          ) : (
            <FFTableText color="secondary" text={t('noGroup')} />
          ),
        },
        {
          value: <HashPopover shortHash address={batch.author}></HashPopover>,
        },
        {
          value: <HashPopover shortHash address={batch.key}></HashPopover>,
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(batch.created)} />
          ),
        },
        {
          value: (
            <DownloadJsonButton
              jsonString={JSON.stringify(batch.manifest)}
              filename={`${batch.id}.json`}
            />
          ),
        },
      ],
      onClick: () => {
        setViewBatch(batch);
        setSlideSearchParam(batch.id);
      },
    })
  );

  return (
    <>
      <Header
        title={t('batches')}
        subtitle={t('offChain')}
        showRefreshBtn={hasDataEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <FFPageLayout>
        <ChartTableHeader
          filter={
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
          records={batchRecords}
          columnHeaders={batchColHeaders}
          paginate={true}
          emptyStateText={t('noBatchesToDisplay')}
          dataTotal={batchTotal}
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
          fields={BatchFilters}
        />
      )}
      {viewBatch && (
        <BatchSlide
          batch={viewBatch}
          open={!!viewBatch}
          onClose={() => {
            setViewBatch(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
