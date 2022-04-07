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

import { Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterButton } from '../../../components/Filters/FilterButton';
import { FilterModal } from '../../../components/Filters/FilterModal';
import { Header } from '../../../components/Header';
import { ChartTableHeader } from '../../../components/Headers/ChartTableHeader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { IdentitySlide } from '../../../components/Slides/IdentitySlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IDataTableRecord,
  IdentityFilters,
  IIdentity,
  IPagedIdentityResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import { hasIdentityEvent } from '../../../utils/wsEvents';

export const NetworkIdentities: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { setSlideSearchParam, slideID } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const [identities, setIdentities] = useState<IIdentity[]>();
  const [identitiesTotal, setIdentitiesTotal] = useState(0);
  const [viewIdentity, setViewIdentity] = useState<string>();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[1]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    isMounted && slideID && setViewIdentity(slideID);
  }, [slideID, isMounted]);

  // Identities
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.identities
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          filterString ?? ''
        }&sort=created`
      )
        .then((identityRes: IPagedIdentityResponse) => {
          if (isMounted) {
            setIdentities(identityRes.items);
            setIdentitiesTotal(identityRes.total);
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

  const idColHeaders = [
    t('name'),
    t('id'),
    t('did'),
    t('type'),
    t('parent'),
    t('updated'),
  ];
  const idRecords: IDataTableRecord[] | undefined = identities?.map((id) => {
    return {
      key: id.id,
      columns: [
        {
          value: <FFTableText color="primary" text={id.name} />,
        },
        {
          value: <HashPopover shortHash={true} address={id.id} />,
        },
        {
          value: <HashPopover address={id.did} />,
        },
        {
          value: <FFTableText color="primary" text={id.type} />,
        },
        {
          value: id.parent ? (
            <HashPopover address={id.parent} />
          ) : (
            <FFTableText color="secondary" text={t('noParentForIdentity')} />
          ),
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(id.updated, true)} />
          ),
        },
      ],
      onClick: () => {
        setViewIdentity(id.did);
        setSlideSearchParam(id.did);
      },
    };
  });

  return (
    <>
      <Header
        title={t('identities')}
        subtitle={t('network')}
        noDateFilter
        showRefreshBtn={hasIdentityEvent(newEvents)}
        onRefresh={clearNewEvents}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
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
            records={idRecords}
            columnHeaders={idColHeaders}
            paginate={true}
            emptyStateText={t('noIdentitiesInNs')}
            dataTotal={identitiesTotal}
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
          fields={IdentityFilters}
        />
      )}
      {viewIdentity && (
        <IdentitySlide
          did={viewIdentity}
          open={!!viewIdentity}
          onClose={() => {
            setViewIdentity(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
