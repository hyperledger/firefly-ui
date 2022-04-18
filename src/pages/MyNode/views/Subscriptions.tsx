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
import { SubscriptionSlide } from '../../../components/Slides/SubscriptionSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { FilterContext } from '../../../contexts/FilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IDataTableRecord,
  IPagedSubscriptionsResponse,
  ISubscription,
  SubscriptionFilters,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher, getFFTime } from '../../../utils';

export const MyNodeSubscriptions: () => JSX.Element = () => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { filterAnchor, setFilterAnchor, filterString } =
    useContext(FilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const [subscriptions, setSubscriptions] = useState<ISubscription[]>();
  const [subscriptionsTotal, setSubscriptionsTotal] = useState(0);
  const [viewSub, setViewSub] = useState<ISubscription | undefined>();
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
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.subscriptionsById(
          slideID
        )}`
      )
        .then((subRes: ISubscription) => {
          setViewSub(subRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Subscriptions
  useEffect(() => {
    isMounted &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.subscriptions
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          filterString ?? ''
        }&sort=created`
      )
        .then((subRes: IPagedSubscriptionsResponse) => {
          if (isMounted) {
            setSubscriptions(subRes.items);
            setSubscriptionsTotal(subRes.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [rowsPerPage, currentPage, selectedNamespace, filterString, isMounted]);

  const subColHeaders = [t('name'), t('id'), t('transport'), t('created')];
  const subRecords: IDataTableRecord[] | undefined = subscriptions?.map(
    (sub) => {
      return {
        key: sub.id,
        columns: [
          {
            value: <HashPopover address={sub.name} />,
          },
          {
            value: <HashPopover shortHash={true} address={sub.id} />,
          },
          {
            value: <HashPopover address={sub.transport} />,
          },
          {
            value: (
              <FFTableText
                color="secondary"
                text={getFFTime(sub.created, true)}
              />
            ),
          },
        ],
        onClick: () => {
          setViewSub(sub);
          setSlideSearchParam(sub.id);
        },
      };
    }
  );

  return (
    <>
      <Header
        title={t('subscriptions')}
        subtitle={t('myNode')}
        noDateFilter
        showRefreshBtn={false}
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
          records={subRecords}
          columnHeaders={subColHeaders}
          paginate={true}
          emptyStateText={t('noSubscriptionsToDisplay')}
          dataTotal={subscriptionsTotal}
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
          fields={SubscriptionFilters}
        />
      )}
      {viewSub && (
        <SubscriptionSlide
          sub={viewSub}
          open={!!viewSub}
          onClose={() => {
            setViewSub(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
