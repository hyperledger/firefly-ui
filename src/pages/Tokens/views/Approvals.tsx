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
import { ApprovalSlide } from '../../../components/Slides/ApprovalSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { PoolContext } from '../../../contexts/PoolContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  ApprovalFilters,
  FF_Paths,
  IDataTableRecord,
  IPagedTokenApprovalResponse,
  ITokenApproval,
  ITokenApprovalWithPoolName,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, fetchPool, getFFTime } from '../../../utils';
import { hasApprovalEvent } from '../../../utils/wsEvents';

export const TokensApprovals: () => JSX.Element = () => {
  const { newEvents, lastRefreshTime, clearNewEvents, selectedNamespace } =
    useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { poolCache, setPoolCache } = useContext(PoolContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);
  // Token approvals
  const [tokenApprovals, setTokenApprovals] =
    useState<ITokenApprovalWithPoolName[]>();
  // Token approvals totals
  const [tokenApprovalsTotal, setTokenApprovalsTotal] = useState(0);
  const [viewApproval, setViewApproval] =
    useState<ITokenApprovalWithPoolName>();
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
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenApprovals}?localid=${slideID}`
      )
        .then(async (approvalRes: ITokenApproval[]) => {
          if (isMounted && approvalRes.length === 1) {
            const item = approvalRes[0];
            const pool = await fetchPool(
              selectedNamespace,
              item.pool,
              poolCache,
              setPoolCache
            );
            const approvalWithPoolName: ITokenApprovalWithPoolName = {
              ...item,
              poolName: pool ? pool.name : item.pool,
            };
            setViewApproval(approvalWithPoolName);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Token approvals
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenApprovals
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }${filterString ?? ''}`
      )
        .then(async (tokenApprovalRes: IPagedTokenApprovalResponse) => {
          if (tokenApprovalRes.items === null) {
            setTokenApprovals([]);
            setTokenApprovalsTotal(tokenApprovalRes.total);
            return;
          }
          for (const item of tokenApprovalRes.items) {
            const pool = await fetchPool(
              selectedNamespace,
              item.pool,
              poolCache,
              setPoolCache
            );
            const approval: ITokenApprovalWithPoolName = {
              ...item,
              poolName: pool ? pool.name : item.pool,
            };
            setTokenApprovals((tokenApprovals) => {
              return tokenApprovals
                ? [...tokenApprovals, approval]
                : [approval];
            });
          }
          if (tokenApprovalRes.items.length === 0) {
            setTokenApprovals([]);
          }
          setTokenApprovalsTotal(tokenApprovalRes.total);
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

  const tokenApprovalColHeaders = [
    t('id'),
    t('signingKey'),
    t('operator'),
    t('pool'),
    t('active'),
    t('approved'),
    t('created'),
  ];
  const tokenApprovalRecords: IDataTableRecord[] | undefined =
    tokenApprovals?.map((approval, idx) => ({
      key: idx.toString(),
      columns: [
        {
          value: <HashPopover address={approval.localId} />,
        },
        {
          value: <HashPopover address={approval.key} />,
        },
        {
          value: <HashPopover address={approval.operator} />,
        },
        {
          value: <HashPopover address={approval.poolName} />,
        },
        {
          value: (
            <FFTableText
              color="primary"
              text={
                approval.active ? t('yes').toUpperCase() : t('no').toUpperCase()
              }
            />
          ),
        },
        {
          value: (
            <FFTableText
              color="primary"
              text={
                approval.approved
                  ? t('yes').toUpperCase()
                  : t('no').toUpperCase()
              }
            />
          ),
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={getFFTime(approval.created)}
              tooltip={getFFTime(approval.created, true)}
            />
          ),
        },
      ],
      onClick: () => {
        setViewApproval(approval);
        setSlideSearchParam(approval.localId);
      },
    }));

  return (
    <>
      <Header
        title={t('approvals')}
        subtitle={t('tokens')}
        showRefreshBtn={hasApprovalEvent(newEvents)}
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
          records={tokenApprovalRecords}
          columnHeaders={tokenApprovalColHeaders}
          paginate={true}
          emptyStateText={t('noTokenApprovalsToDisplay')}
          dataTotal={tokenApprovalsTotal}
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
          fields={ApprovalFilters}
        />
      )}
      {viewApproval && (
        <ApprovalSlide
          approval={viewApproval}
          open={!!viewApproval}
          onClose={() => {
            setViewApproval(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
