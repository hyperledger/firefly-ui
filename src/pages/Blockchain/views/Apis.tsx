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

import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton, Link } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadButton } from '../../../components/Buttons/DownloadButton';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { ApiSlide } from '../../../components/Slides/ApiSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  ApiFilters,
  FF_Paths,
  IDataTableRecord,
  IFireflyApi,
  IPagedFireFlyApiResponse,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher } from '../../../utils';
import { hasApiEvent } from '../../../utils/wsEvents';

export const BlockchainApis: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { setSlideSearchParam, slideID } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  // APIs
  const [apis, setApis] = useState<IFireflyApi[]>();
  // API Totals
  const [apiTotal, setApiTotal] = useState(0);
  const [viewApi, setViewApi] = useState<IFireflyApi>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Slide for api
  useEffect(() => {
    isMounted &&
      slideID &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.apisByName(
          slideID
        )}`
      )
        .then((apiRes: IFireflyApi) => {
          setViewApi(apiRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // APIs
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.apis
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((apis: IPagedFireFlyApiResponse) => {
          if (isMounted) {
            setApis(apis.items);
            setApiTotal(apis.total);
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

  const apiColHeaders = [
    t('endpoint'),
    t('name'),
    t('id'),
    t('interfaceID'),
    t('openApi'),
    t('ui'),
  ];

  const apiRecords: IDataTableRecord[] | undefined = apis?.map((api) => ({
    key: api.id,
    columns: [
      {
        value: (
          <HashPopover
            address={`${FF_Paths.nsPrefix}/${selectedNamespace}/apis/${api.name}`}
            fullLength
          />
        ),
      },
      {
        value: <FFTableText color="primary" text={api.name} />,
      },
      {
        value: <HashPopover shortHash={true} address={api.id}></HashPopover>,
      },
      {
        value: (
          <HashPopover
            shortHash={true}
            address={api.interface.id}
          ></HashPopover>
        ),
      },
      {
        value: (
          <DownloadButton
            filename={api.name}
            url={api.urls.openapi}
            isBlob={false}
            namespace={selectedNamespace}
          />
        ),
      },
      {
        value: (
          <Link
            target="_blank"
            href={api.urls.ui}
            underline="always"
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton>
              <LaunchIcon />
            </IconButton>
          </Link>
        ),
      },
    ],
    onClick: () => {
      setViewApi(api);
      setSlideSearchParam(api.name);
    },
  }));

  return (
    <>
      <Header
        title={t('apis')}
        subtitle={t('blockchain')}
        showRefreshBtn={hasApiEvent(newEvents)}
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
          records={apiRecords}
          columnHeaders={apiColHeaders}
          paginate={true}
          emptyStateText={t('noApisToDisplay')}
          dataTotal={apiTotal}
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
          fields={ApiFilters}
        />
      )}
      {viewApi && (
        <ApiSlide
          api={viewApi}
          open={!!viewApi}
          onClose={() => {
            setViewApi(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
