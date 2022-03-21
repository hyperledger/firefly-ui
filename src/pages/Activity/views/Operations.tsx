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

import { Box, Chip, Grid } from '@mui/material';
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
import { OperationSlide } from '../../../components/Slides/OperationSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
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
  IOperation,
  IPagedOperationResponse,
  OperationFilters,
} from '../../../interfaces';
import {
  FF_OP_CATEGORY_MAP,
  OpStatusColorMap,
} from '../../../interfaces/enums';
import {
  DEFAULT_HIST_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_PAGE_LIMITS,
} from '../../../theme';
import {
  fetchCatcher,
  getCreatedFilter,
  getFFTime,
  makeOperationHistogram,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { isEventType, WsEventTypes } from '../../../utils/wsEvents';

export const ActivityOperations: () => JSX.Element = () => {
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
  const [isMounted, setIsMounted] = useState(false);
  // Operations
  const [ops, setOps] = useState<IOperation[]>();
  // Operation totals
  const [opTotal, setOpTotal] = useState(0);
  // View transaction slide out
  const [viewOp, setViewOp] = useState<IOperation>();
  // Op types histogram
  const [opHistData, setOpHistData] = useState<BarDatum[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);
  // Last event tracking
  const [numNewEvents, setNumNewEvents] = useState(0);
  const [lastRefreshTime, setLastRefresh] = useState<string>(
    new Date().toISOString()
  );

  useEffect(() => {
    // TODO: Figure out best type to filter by
    isMounted &&
      isEventType(lastEvent, WsEventTypes.EVENT) &&
      setNumNewEvents(numNewEvents + 1);
  }, [lastEvent]);

  const refreshData = () => {
    setNumNewEvents(0);
    setLastRefresh(new Date().toString());
  };

  useEffect(() => {
    setIsMounted(true);
    setNumNewEvents(0);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Operations
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.operations
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          createdFilterObject.filterString
        }${filterString !== undefined ? filterString : ''}`
      )
        .then((opRes: IPagedOperationResponse) => {
          if (isMounted) {
            setOps(opRes.items);
            setOpTotal(opRes.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => numNewEvents !== 0 && setNumNewEvents(0));
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    createdFilter,
    filterString,
    lastRefreshTime,
    isMounted,
  ]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
          BucketCollectionEnum.Operations,
          createdFilterObject.filterTime,
          currentTime,
          BucketCountEnum.Large
        )}`
      )
        .then((histTypes: IMetric[]) => {
          isMounted && setOpHistData(makeOperationHistogram(histTypes));
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [selectedNamespace, createdFilter, lastRefreshTime, isMounted]);

  const opsColumnHeaders = [
    t('type'),
    t('operationID'),
    t('plugin'),
    t('transactionID'),
    t('status'),
    t('updated'),
  ];

  const opsRecords: IDataTableRecord[] | undefined = ops?.map((op) => ({
    key: op.id,
    columns: [
      {
        value: (
          <FFTableText
            color="primary"
            text={t(FF_OP_CATEGORY_MAP[op.type]?.nicename)}
          />
        ),
      },
      {
        value: <HashPopover shortHash={true} address={op.id}></HashPopover>,
      },
      {
        value: <FFTableText color="primary" text={op.plugin} />,
      },
      {
        value: <HashPopover shortHash={true} address={op.tx}></HashPopover>,
      },
      {
        value: (
          <Chip
            sx={{ backgroundColor: OpStatusColorMap[op.status] }}
            label={op.status?.toLocaleUpperCase()}
          ></Chip>
        ),
      },
      { value: <FFTableText color="secondary" text={getFFTime(op.created)} /> },
    ],
    onClick: () => setViewOp(op),
    leftBorderColor: FF_OP_CATEGORY_MAP[op.type]?.color,
  }));

  return (
    <>
      <Header
        title={t('operations')}
        subtitle={t('activity')}
        onRefresh={refreshData}
        numNewEvents={numNewEvents}
        showNumNewEvents={false}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allOperations')}
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
          <Box height={DEFAULT_HIST_HEIGHT}>
            <Histogram
              colors={makeColorArray(FF_OP_CATEGORY_MAP)}
              data={opHistData}
              indexBy="timestamp"
              keys={makeKeyArray(FF_OP_CATEGORY_MAP)}
              includeLegend={true}
              emptyText={t('noOperations')}
              isEmpty={isHistogramEmpty(opHistData ?? [])}
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
            records={opsRecords}
            columnHeaders={opsColumnHeaders}
            paginate={true}
            emptyStateText={t('noOperationsToDisplay')}
            dataTotal={opTotal}
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
          fields={OperationFilters}
          addFilter={(filter: string) =>
            setActiveFilters((activeFilters) => [...activeFilters, filter])
          }
        />
      )}
      {viewOp && (
        <OperationSlide
          op={viewOp}
          open={!!viewOp}
          onClose={() => {
            setViewOp(undefined);
          }}
        />
      )}
    </>
  );
};
