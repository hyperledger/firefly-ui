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
import { DownloadButton } from '../../../components/Buttons/DownloadButton';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataSlide } from '../../../components/Slides/DataSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import prettyBytes from 'pretty-bytes';
import {
  DataFilters,
  FF_Paths,
  IData,
  IDataTableRecord,
  IPagedDataResponse,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import { hasDataEvent } from '../../../utils/wsEvents';

export const OffChainData: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
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
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.dataById(slideID)}`
      )
        .then((dataRes: IData) => {
          setViewData(dataRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Data
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.data
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((dataRes: IPagedDataResponse) => {
          if (isMounted) {
            setData(dataRes.items);
            setDataTotal(dataRes.total);
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

  const dataColHeaders = [
    t('id'),
    t('validator'),
    t('dataHash'),
    t('blobName'),
    t('blobSize'),
    t('created'),
    t(''),
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
          <FFTableText color="primary" text={`${prettyBytes(d.blob.size)}`} />
        ) : (
          <FFTableText color="secondary" text={t('---')} />
        ),
      },
      {
        value: (
          <FFTableText
            color="secondary"
            text={getFFTime(d.created)}
            tooltip={getFFTime(d.created, true)}
          />
        ),
      },
      {
        value: d.blob && (
          <DownloadButton
            isBlob
            url={d.id}
            filename={d.blob?.name}
            namespace={selectedNamespace}
          />
        ),
      },
    ],
    onClick: () => {
      setViewData(d);
      setSlideSearchParam(d.id);
    },
  }));

  return (
    <>
      <Header
        title={t('data')}
        subtitle={t('offChain')}
        showRefreshBtn={hasDataEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <FFPageLayout>
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
          filterButton={
            <FilterButton
              onSetFilterAnchor={(e: React.MouseEvent<HTMLButtonElement>) =>
                setFilterAnchor(e.currentTarget)
              }
            />
          }
        />
      </FFPageLayout>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={DataFilters}
        />
      )}
      {viewData && (
        <DataSlide
          data={viewData}
          open={!!viewData}
          onClose={() => {
            setViewData(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
