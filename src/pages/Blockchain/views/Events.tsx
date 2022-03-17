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
import { Histogram } from '../../../components/Charts/Histogram';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BlockchainEventFilters,
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  IBlockchainEvent,
  ICreatedFilter,
  IDataTableRecord,
  IMetric,
  IPagedBlockchainEventResponse,
} from '../../../interfaces';
import { FF_BE_CATEGORY_MAP } from '../../../interfaces/enums/blockchainEventTypes';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS, FFColors } from '../../../theme';
import { fetchCatcher, getCreatedFilter } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { makeBlockchainEventHistogram } from '../../../utils/histograms/blockchainEventHistogram';

export const BlockchainEvents: () => JSX.Element = () => {
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
  // Blockchain Events
  const [blockchainEvents, setBlockchainEvents] =
    useState<IBlockchainEvent[]>();
  // Blockchain Events total
  const [blockchainEventTotal, setBlockchainEventTotal] = useState(0);
  // View blockchain event slide out
  const [viewBlockchainEvent, setViewBlockchainEvent] = useState<
    IBlockchainEvent | undefined
  >();

  // Events histogram
  const [beHistData, setBeHistData] = useState<BarDatum[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  // Blockchain events
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.blockchainEvents
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }${filterString !== undefined ? filterString : ''}`
    )
      .then((blockchainEvents: IPagedBlockchainEventResponse) => {
        setBlockchainEvents(blockchainEvents.items);
        setBlockchainEventTotal(blockchainEvents.total);
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
        BucketCollectionEnum.BlockchainEvents,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Large
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setBeHistData(makeBlockchainEventHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

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
          value: <Typography>{be.name}</Typography>,
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
        { value: dayjs(be.timestamp).format('MM/DD/YYYY h:mm A') },
      ],
      leftBorderColor: FFColors.Yellow,
    })
  );

  return (
    <>
      <Header title={t('blockchainEvents')} subtitle={t('blockchain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allBlockchainEvents')}
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
            colors={makeColorArray(FF_BE_CATEGORY_MAP)}
            data={beHistData}
            indexBy="timestamp"
            keys={makeKeyArray(FF_BE_CATEGORY_MAP)}
            includeLegend={true}
            emptyText={t('noBlockchainEvents')}
            isEmpty={isHistogramEmpty(beHistData ?? [])}
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
          addFilter={(filter: string) =>
            setActiveFilters((activeFilters) => [...activeFilters, filter])
          }
        />
      )}
    </>
  );
};
