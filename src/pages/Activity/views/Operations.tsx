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
  IOperation,
  IPagedOperationResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import {
  fetchCatcher,
  isEventHistogramEmpty,
  makeOperationHistogram,
} from '../../../utils';

const PAGE_LIMITS = [10, 25];

export const ActivityOperations: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Operations
  const [ops, setOps] = useState<IOperation[]>();
  // Operation totals
  const [opTotal, setOpTotal] = useState(0);
  // View transaction slide out
  const [viewOp, setViewOp] = useState<IOperation | undefined>();
  // Event types histogram
  const [opHistData, setOpHistData] = useState<BarDatum[]>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (newPage > currentPage && rowsPerPage * (currentPage + 1) >= opTotal) {
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

  // Operations
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.operations
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((opRes: IPagedOperationResponse) => {
        setOps(opRes.items);
        setOpTotal(opRes.total);
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
        BucketCollectionEnum.Operations
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=${BucketCountEnum.Large}`
    )
      .then((histTypes: IMetricType[]) => {
        setOpHistData(makeOperationHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const opsColumnHeaders = [
    t('type'),
    t('operationID'),
    t('transactionID'),
    t('updated'),
    t('status'),
  ];

  const opsRecords: IDataTableRecord[] | undefined = ops?.map((op) => ({
    key: op.id,
    columns: [
      {
        value: <Typography>{op.type.toLocaleUpperCase()}</Typography>,
      },
      {
        value: <HashPopover shortHash={true} address={op.id}></HashPopover>,
      },
      {
        value: <HashPopover shortHash={true} address={op.tx}></HashPopover>,
      },
      { value: dayjs(op.updated).format('MM/DD/YYYY h:mm A') },
      {
        value: <Chip color="success" label="Success"></Chip>,
      },
    ],
    onClick: () => setViewOp(op),
  }));

  return (
    <>
      <Header title={t('operations')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title={t('allOperations')}
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
            {!opHistData ? (
              <FFCircleLoader height={200} color="warning"></FFCircleLoader>
            ) : isEventHistogramEmpty(opHistData) ? (
              <CardEmptyState
                height={200}
                text={t('noOperations')}
              ></CardEmptyState>
            ) : (
              <Histogram
                colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
                data={opHistData}
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
          {!ops ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : ops.length ? (
            <DataTable
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={opsRecords}
              columnHeaders={opsColumnHeaders}
              {...{ pagination }}
            />
          ) : (
            <DataTableEmptyState
              message={t('noOperationsToDisplay')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </Grid>
      {viewOp && (
        <TransactionSlide
          txID={viewOp.tx}
          open={!!viewOp}
          onClose={() => {
            setViewOp(undefined);
          }}
        />
      )}
    </>
  );
};
