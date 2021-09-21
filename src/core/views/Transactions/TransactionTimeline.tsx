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
import { IHistory, IPagedTransactionResponse } from '../../interfaces';
import { useHistory } from 'react-router';
import dayjs from 'dayjs';
import BroadcastIcon from 'mdi-react/BroadcastIcon';
import { DataTimeline } from '../../components/DataTimeline/DataTimeline';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { InfiniteData, useInfiniteQuery, useQueryClient } from 'react-query';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { fetchWithCredentials } from '../../utils';

const ROWS_PER_PAGE = 25;

export const TransactionTimeline: React.FC = () => {
  const history = useHistory<IHistory>();
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
        let createdFilterString = `&created=>=${dayjs()
          .subtract(24, 'hours')
          .unix()}`;
        if (createdFilter === '30days') {
          createdFilterString = `&created=>=${dayjs()
            .subtract(30, 'days')
            .unix()}`;
        }
        if (createdFilter === '7days') {
          createdFilterString = `&created=>=${dayjs()
            .subtract(7, 'days')
            .unix()}`;
        }
        const res = await fetchWithCredentials(
          `/api/v1/namespaces/${selectedNamespace}/transactions?count&limit=${ROWS_PER_PAGE}&skip=${
            ROWS_PER_PAGE * pageParam
          }${createdFilterString}`
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
    queryClient.resetQueries('transactions');
  }, [createdFilter, queryClient]);

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
        title: tx.hash,
        description: tx.status,
        time: dayjs(tx.created).format('MM/DD/YYYY h:mm A'),
        icon: <BroadcastIcon />,
        author: tx.subject.signer,
        onClick: () => {
          history.push(`/namespace/${selectedNamespace}/transactions/${tx.id}`);
        },
      }));
    } else {
      return [];
    }
  };

  return (
    <DataTimeline
      items={buildTimelineElements(data)}
      observerRef={loadingRef}
      {...{ isFetching }}
    />
  );
};
