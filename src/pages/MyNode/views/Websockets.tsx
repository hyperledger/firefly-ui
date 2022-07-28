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
import { Header } from '../../../components/Header';
import { FFPageLayout } from '../../../components/Layouts/FFPageLayout';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { WebsocketSlide } from '../../../components/Slides/WebsocketSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { DataTable } from '../../../components/Tables/Table';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_Paths,
  IDataTableRecord,
  IWebsocketConnection,
  IWebsocketStatus,
} from '../../../interfaces';
import { DEFAULT_PAGE_LIMITS } from '../../../theme';
import { fetchCatcher } from '../../../utils';

export const MyNodeWebsockets: () => JSX.Element = () => {
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  const [wsConns, setWsConns] = useState<IWebsocketConnection[]>();
  const [wsConnsTotal, setWsConnsTotal] = useState(0);
  const [viewWs, setViewWs] = useState<IWebsocketConnection | undefined>();
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
      fetchCatcher(`${FF_Paths.apiPrefix}/${FF_Paths.statusWebsockets}`)
        .then((wsRes: IWebsocketStatus) => {
          if (isMounted) {
            const filteredWS = wsRes.connections.filter(
              (ws) => ws.id === slideID
            );
            filteredWS.length > 0 && setViewWs(filteredWS[0]);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  // Websockets
  useEffect(() => {
    isMounted &&
      fetchCatcher(`${FF_Paths.apiPrefix}/${FF_Paths.statusWebsockets}`)
        .then((wsRes: IWebsocketStatus) => {
          if (isMounted) {
            setWsConns(wsRes.connections);
            setWsConnsTotal(wsRes.connections.length);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [isMounted]);

  const wsColHeaders = [
    t('id'),
    t('remoteAddress'),
    t('userAgent'),
    t('numberOfSubscriptions'),
  ];
  const wsRecords: IDataTableRecord[] | undefined = wsConns?.map((ws) => {
    return {
      key: ws.id,
      columns: [
        {
          value: <HashPopover shortHash address={ws.id} />,
        },
        {
          value: <HashPopover address={ws.remoteAddress} />,
        },
        {
          value: ws.userAgent.length ? (
            <HashPopover address={ws.userAgent} />
          ) : (
            <FFTableText color="secondary" text={t('notSpecified')} />
          ),
        },
        {
          value: (
            <FFTableText
              color="secondary"
              text={ws.subscriptions.length.toString()}
            />
          ),
        },
      ],
      onClick: () => {
        setViewWs(ws);
        setSlideSearchParam(ws.id);
      },
    };
  });

  return (
    <>
      <Header
        title={t('websockets')}
        subtitle={t('myNode')}
        noDateFilter
        noNsFilter
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
          records={wsRecords}
          columnHeaders={wsColHeaders}
          paginate={true}
          emptyStateText={t('noWebsocketConnectionsToDisplay')}
          dataTotal={wsConnsTotal}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />
      </FFPageLayout>
      {viewWs && (
        <WebsocketSlide
          ws={viewWs}
          open={!!viewWs}
          onClose={() => {
            setViewWs(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
