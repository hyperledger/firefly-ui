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

import { Button, Grid, TablePagination, Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartHeader } from '../../../components/Charts/Header';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataTable } from '../../../components/Tables/Table';
import { DataTableEmptyState } from '../../../components/Tables/TableEmptyState';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IBlockchainEvent,
  ICreatedFilter,
  IPagedBlockchainEventResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING } from '../../../theme';
import { fetchCatcher } from '../../../utils';

const PAGE_LIMITS = [10, 25];

export const BlockchainEvents: () => JSX.Element = () => {
  const { createdFilter, lastEvent, orgName, selectedNamespace } =
    useContext(ApplicationContext);
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

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (
      newPage > currentPage &&
      rowsPerPage * (currentPage + 1) >= blockchainEventTotal
    ) {
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

  // Token pools
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.blockchainEvents
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((blockchainEvents: IPagedBlockchainEventResponse) => {
        setBlockchainEvents(blockchainEvents.items);
        setBlockchainEventTotal(blockchainEvents.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  const beColHeaders = [
    t('sequence'),
    t('name'),
    t('id'),
    t('address'),
    t('timestamp'),
  ];
  const beRecords: IDataTableRecord[] | undefined = blockchainEvents?.map(
    (be) => ({
      key: be.id,
      columns: [
        {
          value: <Typography>{be.sequence}</Typography>,
        },
        {
          value: <Typography>{be.name}</Typography>,
        },
        {
          value: <HashPopover shortHash={true} address={be.id}></HashPopover>,
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={be.info?.address ?? ''}
            ></HashPopover>
          ),
        },
        { value: dayjs(be.timestamp).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => setViewBlockchainEvent(be),
    })
  );

  return (
    <>
      <Header title={t('blockchainEvents')} subtitle={t('blockchain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title={t('allBlockchainEvents')}
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
            {/* {!messageHistData ? (
              <FFCircleLoader height={200} color="warning"></FFCircleLoader>
            ) : isEventHistogramEmpty(messageHistData) ? (
              <CardEmptyState
                height={200}
                text={t('noMessages')}
              ></CardEmptyState>
            ) : (
              <Histogram
                colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
                data={messageHistData}
                indexBy="timestamp"
                keys={[
                  EventKeyEnum.BLOCKCHAIN,
                  EventKeyEnum.MESSAGES,
                  EventKeyEnum.TOKENS,
                ]}
                includeLegend={true}
              ></Histogram>
            )} */}
          </Box>
          {!blockchainEvents ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : blockchainEvents.length ? (
            <DataTable
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={beRecords}
              columnHeaders={beColHeaders}
              {...{ pagination }}
            />
          ) : (
            <DataTableEmptyState
              message={t('noBlockchainEventsToDisplay')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </Grid>
    </>
  );
};
