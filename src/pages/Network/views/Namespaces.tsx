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
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { NamespaceSlide } from '../../../components/Slides/NamespaceSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IDataTableRecord,
  INamespace,
  IPagesNamespaceResponse,
  NamespaceFilters,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import { hasIdentityEvent } from '../../../utils/wsEvents';

export const NetworkNamespaces: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { setSlideSearchParam, slideID } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const [namespaces, setNamespaces] = useState<INamespace[]>();
  const [nsTotal, setNsTotal] = useState(0);
  const [viewNs, setViewNs] = useState<INamespace>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    isMounted && slideID;
    fetchCatcher(`${FF_Paths.nsPrefix}?id=${slideID}`)
      .then((nsRes: INamespace[]) => {
        isMounted && nsRes.length === 1 && setViewNs(nsRes[0]);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [slideID, isMounted]);

  // Namespaces
  useEffect(() => {
    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}?limit=${rowsPerPage}&count&skip=${
          rowsPerPage * currentPage
        }${filterString ?? ''}&sort=created`
      )
        .then((nsRes: IPagesNamespaceResponse) => {
          if (isMounted) {
            setNamespaces(nsRes.items);
            setNsTotal(nsRes.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [
    rowsPerPage,
    currentPage,
    selectedNamespace,
    filterString,
    lastRefreshTime,
    isMounted,
  ]);

  const nsColHeaders = [
    t('name'),
    t('description'),
    t('type'),
    t('id'),
    t('message'),
    t('created'),
  ];
  const nsRecords: IDataTableRecord[] | undefined = namespaces?.map((ns) => {
    return {
      key: ns.id,
      columns: [
        {
          value: <FFTableText color="primary" text={ns.name} />,
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={ns.description.length ? ns.description : t('noDescription')}
            />
          ),
        },
        {
          value: <FFTableText color="primary" text={ns.type} />,
        },
        {
          value: <HashPopover address={ns.id} />,
        },
        {
          value: ns.message ? (
            <HashPopover address={ns.message} />
          ) : (
            <FFTableText color="secondary" text={t('noMessageID')} />
          ),
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(ns.created, true)} />
          ),
        },
      ],
      onClick: () => {
        setViewNs(ns);
        setSlideSearchParam(ns.id);
      },
    };
  });

  return (
    <>
      <Header
        title={t('namespaces')}
        subtitle={t('network')}
        noDateFilter
        noNsFilter
        showRefreshBtn={hasIdentityEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <FFPageLayout>
        <ChartTableHeader
          filter={
            <FilterButton
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
          records={nsRecords}
          columnHeaders={nsColHeaders}
          paginate={true}
          emptyStateText={t('noNamespaces')}
          dataTotal={nsTotal}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />
      </FFPageLayout>
      {filterAnchor && (
        <FilterModal
          anchor={filterAnchor}
          onClose={() => {
            setFilterAnchor(null);
          }}
          fields={NamespaceFilters}
        />
      )}
      {viewNs && (
        <NamespaceSlide
          ns={viewNs}
          open={!!viewNs}
          onClose={() => {
            setViewNs(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
