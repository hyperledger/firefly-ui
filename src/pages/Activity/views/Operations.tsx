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
  getFFTime,
  makeOperationHistogram,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

export const ActivityOperations: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
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
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operationsById(
          slideID
        )}`
      )
        .then((opRes: IOperation) => {
          setViewOp(opRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Operations
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.operations
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((opRes: IPagedOperationResponse) => {
          if (isMounted) {
            setOps(opRes.items);
            setOpTotal(opRes.total);
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
          BucketCollectionEnum.Operations,
          dateFilter.filterTime,
          currentTime,
          BucketCountEnum.Large
        )}`
      )
        .then((histTypes: IMetric[]) => {
          isMounted && setOpHistData(makeOperationHistogram(histTypes));
        })
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => setIsHistLoading(false));
  }, [selectedNamespace, dateFilter, lastRefreshTime, isMounted]);

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
          // TODO: Fix when https://github.com/hyperledger/firefly/issues/628 is resolved
          <Chip
            label={
              op.status?.toLocaleUpperCase() === 'PENDING'
                ? 'SUCCEEDED'
                : op.status?.toLocaleUpperCase()
            }
            sx={{
              backgroundColor:
                OpStatusColorMap[
                  op.status === 'Pending' ? 'Succeeded' : op.status
                ],
            }}
          ></Chip>
        ),
      },
      { value: <FFTableText color="secondary" text={getFFTime(op.created)} /> },
    ],
    onClick: () => {
      setViewOp(op);
      setSlideSearchParam(op.id);
    },
    leftBorderColor: FF_OP_CATEGORY_MAP[op.type]?.color,
  }));

  return (
    <>
      <Header
        title={t('operations')}
        subtitle={t('activity')}
        showRefreshBtn={newEvents.length > 0}
        onRefresh={clearNewEvents}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allOperations')}
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
              colors={makeColorArray(FF_OP_CATEGORY_MAP)}
              data={opHistData}
              indexBy="timestamp"
              keys={makeKeyArray(FF_OP_CATEGORY_MAP)}
              includeLegend={true}
              emptyText={t('noOperations')}
              isLoading={isHistLoading}
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
        />
      )}
      {viewOp && (
        <OperationSlide
          op={viewOp}
          open={!!viewOp}
          onClose={() => {
            setViewOp(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
