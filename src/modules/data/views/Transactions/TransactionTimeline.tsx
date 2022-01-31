// Copyright © 2021 Kaleido, Inc.
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

import React, { useEffect, useContext, useRef } from 'react';
import {
  ICreatedFilter,
  IPagedTransactionResponse,
  ITransaction,
} from '../../../../core/interfaces';
import dayjs from 'dayjs';
import BroadcastIcon from 'mdi-react/BroadcastIcon';
import { DataTimeline } from '../../../../core/components/DataTimeline/DataTimeline';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { InfiniteData, useInfiniteQuery, useQueryClient } from 'react-query';
import useIntersectionObserver from '../../../../core/hooks/useIntersectionObserver';
import { SnackbarContext } from '../../../../core/contexts/SnackbarContext';
import { fetchWithCredentials, getCreatedFilter } from '../../../../core/utils';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { useDataTranslation } from '../../registration';

const ROWS_PER_PAGE = 25;

interface Props {
  filterString?: string;
  setDetailsTx: React.Dispatch<React.SetStateAction<ITransaction | undefined>>;
}

export const TransactionTimeline: React.FC<Props> = ({
  filterString,
  setDetailsTx,
}) => {
  const { t } = useDataTranslation();
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const observer = useIntersectionObserver(loadingRef, {});
  const isVisible = !!observer?.isIntersecting;
  const { createdFilter, lastEvent } = useContext(ApplicationContext);
  const { selectedNamespace } = useContext(NamespaceContext);
  const { setMessage, setMessageType } = useContext(SnackbarContext);
  const queryClient = useQueryClient();
  const { data, isFetching, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery(
      'transactions',
      async ({ pageParam = 0 }) => {
        const createdFilterObject: ICreatedFilter =
          getCreatedFilter(createdFilter);

        const res = await fetchWithCredentials(
          `/api/v1/namespaces/${selectedNamespace}/transactions?count&limit=${ROWS_PER_PAGE}&skip=${
            ROWS_PER_PAGE * pageParam
          }${createdFilterObject.filterString}${
            filterString !== undefined ? filterString : ''
          }`
        );
        if (res.ok) {
          const data = await res.json();
          return {
            pageParam,
            ...data,
          };
        } else {
          setMessageType('error');
          setMessage('Error fetching Transactions');
          throw new Error('Error fetching Transactions');
        }
      },
      {
        getNextPageParam: (lastPage: IPagedTransactionResponse) => {
          return lastPage.count === ROWS_PER_PAGE
            ? lastPage.pageParam + 1
            : undefined;
        },
      }
    );

  useEffect(() => {
    if (isVisible && hasNextPage) {
      fetchNextPage();
    }
  }, [isVisible, hasNextPage, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [createdFilter, queryClient, filterString, refetch]);

  useEffect(() => {
    refetch({ refetchPage: (_page, index) => index === 0 });
  }, [lastEvent, refetch]);

  const buildTimelineElements = (
    data: InfiniteData<IPagedTransactionResponse> | undefined
  ) => {
    if (data) {
      const pages = data.pages.map((page) => page.items);
      return pages.flat().map((tx) => ({
        key: tx.id,
        title: tx.type,
        time: dayjs(tx.created).format('MM/DD/YYYY h:mm A'),
        icon: <BroadcastIcon />,
        onClick: () => {
          setDetailsTx(tx);
        },
      }));
    } else {
      return [];
    }
  };

  return buildTimelineElements(data).length ? (
    <DataTimeline
      items={buildTimelineElements(data)}
      observerRef={loadingRef}
      {...{ isFetching }}
    />
  ) : (
    <DataTableEmptyState
      message={t('noTransactionsToDisplay')}
    ></DataTableEmptyState>
  );
};
