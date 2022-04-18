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
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { InterfaceSlide } from '../../../components/Slides/InterfaceSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IContractInterface,
  IDataTableRecord,
  InterfaceFilters,
  IPagedContractInterfaceResponse,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher } from '../../../utils';
import { hasInterfaceEvent } from '../../../utils/wsEvents';

export const BlockchainInterfaces: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  // Interfaces
  const [interfaces, setInterfaces] = useState<IContractInterface[]>();
  // Interface totals
  const [interfaceTotal, setInterfaceTotal] = useState(0);
  // View interface slide out
  const [viewInterface, setViewInterface] = useState<
    IContractInterface | undefined
  >();
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
        `${
          FF_Paths.nsPrefix
        }/${selectedNamespace}${FF_Paths.contractInterfacesById(slideID)}`
      )
        .then((contractRes: IContractInterface) => {
          setViewInterface(contractRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Interfaces
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.contractInterfaces
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then((interfaceRes: IPagedContractInterfaceResponse) => {
          if (isMounted) {
            setInterfaces(interfaceRes.items);
            setInterfaceTotal(interfaceRes.total);
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

  const interfaceColHeaders = [
    t('name'),
    t('id'),
    t('description'),
    t('messageID'),
    t('version'),
  ];

  const interfaceRecords: IDataTableRecord[] | undefined = interfaces?.map(
    (int) => ({
      key: int.id,
      columns: [
        {
          value: <FFTableText color="primary" text={int.name} />,
        },
        {
          value: <HashPopover shortHash={true} address={int.id}></HashPopover>,
        },
        {
          value:
            int?.description.length > 0 ? (
              <FFTableText color="primary" text={int.description} />
            ) : (
              <FFTableText
                color="secondary"
                text={t('noDescriptionForInterface')}
              />
            ),
        },
        {
          value: (
            <HashPopover shortHash={true} address={int.message}></HashPopover>
          ),
        },
        {
          value: <FFTableText color="primary" text={int.version} />,
        },
      ],
      onClick: () => {
        setViewInterface(int);
        setSlideSearchParam(int.id);
      },
    })
  );

  return (
    <>
      <Header
        title={t('contractInterfaces')}
        subtitle={t('blockchain')}
        showRefreshBtn={hasInterfaceEvent(newEvents)}
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
          records={interfaceRecords}
          columnHeaders={interfaceColHeaders}
          paginate={true}
          emptyStateText={t('noInterfacesToDisplay')}
          dataTotal={interfaceTotal}
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
          fields={InterfaceFilters}
        />
      )}
      {viewInterface && (
        <InterfaceSlide
          cInterface={viewInterface}
          open={!!viewInterface}
          onClose={() => {
            setViewInterface(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
