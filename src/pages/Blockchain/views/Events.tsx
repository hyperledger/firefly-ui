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

import { Box, Grid } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Histogram } from '../../../components/Charts/Histogram';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
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
import {
  DEFAULT_HIST_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_PAGE_LIMITS,
  FFColors,
} from '../../../theme';
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

  const [isHistLoading, setIsHistLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

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
          value: <HashPopover address={be.source}></HashPopover>,
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(be.timestamp)} />
          ),
        },
      ],
      leftBorderColor: FFColors.Yellow,
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
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            filter={
              <FilterButton
                onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setFilterAnchor(e.currentTarget)
                }
              />
            }
          />
          <Box height={DEFAULT_HIST_HEIGHT}>
            <Histogram
              colors={makeColorArray(FF_BE_CATEGORY_MAP)}
              data={beHistData}
              indexBy="timestamp"
              keys={makeKeyArray(FF_BE_CATEGORY_MAP)}
              includeLegend={true}
              isLoading={isHistLoading}
              emptyText={t('noBlockchainEvents')}
              isEmpty={isHistogramEmpty(beHistData ?? [])}
            />
          </Box>
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
            emptyStateText={t('noBlockchainEvents')}
            dataTotal={blockchainEventTotal}
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
          fields={BlockchainEventFilters}
        />
      )}
    </>
  );
};
