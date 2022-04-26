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
import { BlockchainEventSlide } from '../../../components/Slides/BlockchainEventSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BlockchainEventFilters,
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  IBlockchainEvent,
  IDataTableRecord,
  IMetric,
  IPagedBlockchainEventResponse,
} from '../../../interfaces';
import { FF_BE_CATEGORY_MAP } from '../../../interfaces/enums/blockchainEventTypes';
import { DEFAULT_PAGE_LIMITS, FFColors } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeBlockchainEventHistogram } from '../../../utils/histograms/blockchainEventHistogram';
import { hasBlockchainEvent } from '../../../utils/wsEvents';

export const BlockchainEvents: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { setSlideSearchParam, slideID } = useContext(SlideContext);
  const [isMounted, setIsMounted] = useState(false);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Blockchain Events
  const [blockchainEvents, setBlockchainEvents] =
    useState<IBlockchainEvent[]>();
  // Blockchain Events total
  const [blockchainEventTotal, setBlockchainEventTotal] = useState(0);
  // Events histogram
  const [beHistData, setBeHistData] = useState<BarDatum[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);
  const [viewBlockchainEvent, setViewBlockchainEvent] =
    useState<IBlockchainEvent>();

  const [isHistLoading, setIsHistLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Slide for blockchain event
  useEffect(() => {
    isMounted &&
      slideID &&
      fetchCatcher(
        `${
          FF_Paths.nsPrefix
        }/${selectedNamespace}${FF_Paths.blockchainEventsById(slideID)}`
      )
        .then((beRes: IBlockchainEvent) => {
          setViewBlockchainEvent(beRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Blockchain events
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.blockchainEvents
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((blockchainEvents: IPagedBlockchainEventResponse) => {
          if (isMounted) {
            setBlockchainEvents(blockchainEvents.items);
            setBlockchainEventTotal(blockchainEvents.total);
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
          BucketCollectionEnum.BlockchainEvents,
          dateFilter.filterTime,
          currentTime,
          BucketCountEnum.Large
        )}`
      )
        .then((histTypes: IMetric[]) => {
          isMounted && setBeHistData(makeBlockchainEventHistogram(histTypes));
        })
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => setIsHistLoading(false));
  }, [selectedNamespace, dateFilter, lastRefreshTime, isMounted]);

  const beColHeaders = [
    t('name'),
    t('id'),
    t('protocolID'),
    t('blockchainTransaction'),
    t('source'),
    t('timestamp'),
  ];
  const beRecords: IDataTableRecord[] | undefined = blockchainEvents?.map(
    (be) => ({
      key: be.id,
      columns: [
        {
          value: <FFTableText color="primary" text={be.name} />,
        },
        {
          value: <HashPopover shortHash={true} address={be.id}></HashPopover>,
        },
        {
          value: <HashPopover address={be.protocolId}></HashPopover>,
        },
        {
          value: be.tx?.blockchainId ? (
            <HashPopover address={be.tx.blockchainId}></HashPopover>
          ) : (
            <FFTableText color="secondary" text={t('noTxBlockchainId')} />
          ),
        },
        {
          value: <HashPopover shortHash address={be.source}></HashPopover>,
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={getFFTime(be.timestamp)}
              tooltip={getFFTime(be.timestamp, true)}
            />
          ),
        },
      ],
      leftBorderColor: FFColors.Yellow,
      onClick: () => {
        setViewBlockchainEvent(be);
        setSlideSearchParam(be.id);
      },
    })
  );

  return (
    <>
      <Header
        title={t('blockchainEvents')}
        subtitle={t('blockchain')}
        showRefreshBtn={hasBlockchainEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <FFPageLayout>
        <Histogram
          colors={makeColorArray(FF_BE_CATEGORY_MAP)}
          data={beHistData}
          indexBy="timestamp"
          keys={makeKeyArray(FF_BE_CATEGORY_MAP)}
          includeLegend={true}
          isLoading={isHistLoading}
          emptyText={t('noBlockchainEvents')}
          isEmpty={isHistogramEmpty(beHistData ?? [])}
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
          records={beRecords}
          columnHeaders={beColHeaders}
          paginate={true}
          emptyStateText={t('noBlockchainEventsToDisplay')}
          dataTotal={blockchainEventTotal}
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
          fields={BlockchainEventFilters}
        />
      )}
      {viewBlockchainEvent && (
        <BlockchainEventSlide
          be={viewBlockchainEvent}
          open={!!viewBlockchainEvent}
          onClose={() => {
            setViewBlockchainEvent(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
