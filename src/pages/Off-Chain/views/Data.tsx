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

import DownloadIcon from '@mui/icons-material/Download';
import { Grid, IconButton } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataSlide } from '../../../components/Slides/DataSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  DataFilters,
  FF_EVENTS,
  FF_Paths,
  ICreatedFilter,
  IData,
  IDataTableRecord,
  IPagedDataResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import {
  downloadBlobFile,
  fetchCatcher,
  getCreatedFilter,
  getFFTime,
} from '../../../utils';
import { isEventType, WsEventTypes } from '../../../utils/wsEvents';

export const OffChainData: () => JSX.Element = () => {
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
  // Data
  const [data, setData] = useState<IData[]>();
  // Data total
  const [dataTotal, setDataTotal] = useState(0);
  const [viewData, setViewData] = useState<IData | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);
  // Last event tracking
  const [numNewEvents, setNumNewEvents] = useState(0);
  const [lastRefreshTime, setLastRefresh] = useState<string>(
    new Date().toISOString()
  );

  useEffect(() => {
    isMounted &&
      (isEventType(lastEvent, WsEventTypes.MESSAGE) ||
        isEventType(lastEvent, FF_EVENTS.DATATYPE_CONFIRMED)) &&
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

  // Data
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.data
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          createdFilterObject.filterString
        }${filterString !== undefined ? filterString : ''}`
      )
        .then((dataRes: IPagedDataResponse) => {
          if (isMounted) {
            setData(dataRes.items);
            setDataTotal(dataRes.total);
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

  const dataColHeaders = [
    t('id'),
    t('validator'),
    t('dataHash'),
    t('blobName'),
    t('blobSize'),
    t('created'),
  ];

  const dataRecords: IDataTableRecord[] | undefined = data?.map((d) => ({
    key: d.id,
    columns: [
      {
        value: <HashPopover shortHash address={d.id}></HashPopover>,
      },
      {
        value: <FFTableText color="primary" text={d.validator} />,
      },
      {
        value: <HashPopover shortHash address={d.hash}></HashPopover>,
      },
      {
        value: d.blob?.name ? (
          <HashPopover address={d.blob.name} />
        ) : (
          <FFTableText color="secondary" text={t('noBlobName')} />
        ),
      },
      {
        value: d.blob?.size ? (
          <FFTableText color="primary" text={d.blob.size.toString()} />
        ) : (
          <FFTableText color="secondary" text={t('---')} />
        ),
      },
      {
        value: (
          <FFTableText color="secondary" text={getFFTime(d.created, true)} />
        ),
      },
      {
        value: d.blob && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              downloadBlobFile(d.id, d.blob?.name);
            }}
          >
            <DownloadIcon />
          </IconButton>
        ),
      },
    ],
    onClick: () => setViewData(d),
  }));

  return (
    <>
      <Header
        title={t('data')}
        subtitle={t('offChain')}
        onRefresh={refreshData}
        numNewEvents={numNewEvents}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartTableHeader
            title={t('allData')}
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
            records={dataRecords}
            columnHeaders={dataColHeaders}
            paginate={true}
            emptyStateText={t('noDataToDisplay')}
            dataTotal={dataTotal}
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
          fields={DataFilters}
          addFilter={(filter: string) =>
            setActiveFilters((activeFilters) => [...activeFilters, filter])
          }
        />
      )}
      {viewData && (
        <DataSlide
          data={viewData}
          open={!!viewData}
          onClose={() => {
            setViewData(undefined);
          }}
        />
      )}
    </>
  );
};
