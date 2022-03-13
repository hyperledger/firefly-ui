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
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { OperationSlide } from '../../../components/Slides/OperationSlide';
import { DataTable } from '../../../components/Tables/Table';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_Paths,
  ICreatedFilter,
  IMetric,
  IOperation,
  IPagedOperationResponse,
} from '../../../interfaces';
import {
  FF_OP_CATEGORY_MAP,
  OpCategoryEnum,
  OpStatusColorMap,
} from '../../../interfaces/enums';
import { DEFAULT_HIST_HEIGHT, DEFAULT_PADDING } from '../../../theme';
import { fetchCatcher, makeOperationHistogram } from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

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
  const [viewOp, setViewOp] = useState<IOperation>();
  // Op types histogram
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
        BucketCollectionEnum.Operations,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Large
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setOpHistData(makeOperationHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

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
          <Typography>{t(FF_OP_CATEGORY_MAP[op.type].nicename)}</Typography>
        ),
      },
      {
        value: <HashPopover shortHash={true} address={op.id}></HashPopover>,
      },
      {
        value: <Typography>{op.plugin}</Typography>,
      },
      {
        value: <HashPopover shortHash={true} address={op.tx}></HashPopover>,
      },
      {
        value: (
          <Chip
            sx={{ backgroundColor: OpStatusColorMap[op.status] }}
            label={op.status.toLocaleUpperCase()}
          ></Chip>
        ),
      },
      { value: dayjs(op.updated).format('MM/DD/YYYY h:mm A') },
    ],
    onClick: () => setViewOp(op),
    leftBorderColor: FF_OP_CATEGORY_MAP[op.type].color,
  }));

  return (
    <>
      <Header title={t('operations')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
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
              height: DEFAULT_HIST_HEIGHT,
              backgroundColor: 'background.paper',
            }}
          >
            <Histogram
              colors={makeColorArray(FF_OP_CATEGORY_MAP)}
              data={opHistData}
              indexBy="timestamp"
              keys={makeKeyArray(FF_OP_CATEGORY_MAP)}
              includeLegend={true}
              emptyText={t('noOperations')}
              isEmpty={isHistogramEmpty(
                opHistData ?? [],
                Object.keys(OpCategoryEnum)
              )}
            ></Histogram>
          </Box>
          <DataTable
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 340px)"
            records={opsRecords}
            columnHeaders={opsColumnHeaders}
            {...{ pagination }}
            emptyStateText={t('noOperationsToDisplay')}
          />
        </Grid>
      </Grid>
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
