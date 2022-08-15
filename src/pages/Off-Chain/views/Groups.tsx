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
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { GroupSlide } from '../../../components/Slides/GroupSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  GroupFilters,
  IDataTableRecord,
  IGroup,
  IPagedGroupResponse,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';
import { hasOffchainEvent } from '../../../utils/wsEvents';

export const OffChainGroups: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  // Data
  const [groups, setGroups] = useState<IGroup[]>();
  // Data total
  const [groupTotal, setGroupTotal] = useState(0);
  const [viewGroup, setViewGroup] = useState<IGroup | undefined>();
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
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.groupsById(
          slideID
        )}`
      )
        .then((groupRes: IGroup) => {
          setViewGroup(groupRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Group
  useEffect(() => {
    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.groups
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          filterString ?? ''
        }`
      )
        .then((groupRes: IPagedGroupResponse) => {
          if (isMounted) {
            if (groupRes !== undefined) {
              setGroups(groupRes.items);
              setGroupTotal(groupRes.total);
            } else {
              setGroups([]);
              setGroupTotal(0);
            }
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

  const groupColHeaders = [
    t('name'),
    t('groupHash'),
    t('numberOfMembers'),
    t('members'),
    t('created'),
  ];

  const groupRecords: IDataTableRecord[] | undefined = groups?.map((g) => ({
    key: g.hash,
    columns: [
      {
        value: g.name.length ? (
          <FFTableText color="primary" text={g.name} />
        ) : (
          <FFTableText color="secondary" text={t('noNameSpecified')} />
        ),
      },
      {
        value: <HashPopover address={g.hash}></HashPopover>,
      },
      {
        value: (
          <FFTableText color="primary" text={g.members.length.toString()} />
        ),
      },
      {
        value: (
          <Grid container>
            {g.members.map((m) => (
              <Grid item pr={0.25}>
                <HashPopover key={m.identity} address={m.identity} shortHash />
              </Grid>
            ))}
          </Grid>
        ),
      },
      {
        value: (
          <FFTableText
            color="secondary"
            text={getFFTime(g.created)}
            tooltip={getFFTime(g.created, true)}
          />
        ),
      },
    ],
    onClick: () => {
      setViewGroup(g);
      setSlideSearchParam(g.hash);
    },
  }));

  return (
    <>
      <Header
        title={t('groups')}
        subtitle={t('offChain')}
        showRefreshBtn={hasOffchainEvent(newEvents)}
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
          records={groupRecords}
          columnHeaders={groupColHeaders}
          paginate={true}
          emptyStateText={t('noGroupsToDisplay')}
          dataTotal={groupTotal}
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
          fields={GroupFilters}
        />
      )}
      {viewGroup && (
        <GroupSlide
          group={viewGroup}
          open={!!viewGroup}
          onClose={() => {
            setViewGroup(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
