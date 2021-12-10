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

import dayjs from 'dayjs';
import BroadcastIcon from 'mdi-react/BroadcastIcon';
import React, { useContext, useEffect, useRef } from 'react';
import { InfiniteData, useInfiniteQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { DataTableEmptyState } from '../../../../core/components/DataTable/DataTableEmptyState';
import { DataTimeline } from '../../../../core/components/DataTimeline/DataTimeline';
import { ApplicationContext } from '../../../../core/contexts/ApplicationContext';
import { NamespaceContext } from '../../../../core/contexts/NamespaceContext';
import { SnackbarContext } from '../../../../core/contexts/SnackbarContext';
import useIntersectionObserver from '../../../../core/hooks/useIntersectionObserver';
import {
  ICreatedFilter,
  IHistory,
  IMessage,
  IPagedMessageResponse,
} from '../../../../core/interfaces';
import { fetchWithCredentials, getCreatedFilter } from '../../../../core/utils';
import { useDataTranslation } from '../../registration';

const ROWS_PER_PAGE = 25;

interface Props {
  setViewMessage: React.Dispatch<React.SetStateAction<IMessage | undefined>>;
  filterString?: string;
}

export const MessageTimeline: React.FC<Props> = ({
  setViewMessage,
  filterString,
}) => {
  const { t } = useDataTranslation();
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
      'messages',
      async ({ pageParam = 0 }) => {
        const createdFilterObject: ICreatedFilter =
          getCreatedFilter(createdFilter);
        const res = await fetchWithCredentials(
          `/api/v1/namespaces/${selectedNamespace}/messages?count&limit=${ROWS_PER_PAGE}&skip=${
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
          setMessage('Error fetching Messages');
          throw new Error('Error fetching Messages');
        }
      },
      {
        getNextPageParam: (lastPage: IPagedMessageResponse) => {
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
    data: InfiniteData<IPagedMessageResponse> | undefined
  ) => {
    if (data) {
      const pages = data.pages.map((page) => page.items);
      return pages.flat().map((message) => ({
        key: message.header.id,
        title: message.header.type,
        description: message.header.tag,
        author: message.header.key,
        time: dayjs(message.header.created).format('MM/DD/YYYY h:mm A'),
        icon: <BroadcastIcon />,
        onClick: () => {
          setViewMessage(message);
          history.push(
            `/namespace/${selectedNamespace}/data/messages/${message.header.id}`
          );
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
      message={t('noMessagesToDisplay')}
    ></DataTableEmptyState>
  );
};
