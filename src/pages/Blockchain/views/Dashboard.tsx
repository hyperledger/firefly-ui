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

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  Chip,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MediumCard } from '../../../components/Cards/MediumCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { DataTable } from '../../../components/Tables/Table';
import { DataTableEmptyState } from '../../../components/Tables/TableEmptyState';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  EventCategoryEnum,
  EVENTS_PATH,
  FF_Paths,
  IBlockchainEvent,
  ICreatedFilter,
  IGenericPagedResponse,
  IMediumCard,
  IMetric,
  INTERFACES_PATH,
  ISmallCard,
  ITokenAccount,
  ITokenPool,
  SUBSCRIPTIONS_PATH,
} from '../../../interfaces';
import { DEFAULT_PADDING, DEFAULT_SPACING, FFColors } from '../../../theme';
import { fetchCatcher, makeEventHistogram } from '../../../utils';
import { isHistogramEmpty } from '../../../utils/charts';

export const BlockchainDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();
  // Small cards
  // Blockchain Operations
  const [blockchainOpCount, setBlockchainOpCount] = useState<number>();
  const [blockchainOpErrorCount, setBlockchainOpErrorCount] =
    useState<number>(0);
  // Blockchain Transactions
  const [blockchainTxCount, setBlockchainTxCount] = useState<number>();
  const [blockchainTxErrorCount, setBlockchainTxErrorCount] =
    useState<number>(0);
  // Blockchain Events
  const [blockchainEventCount, setBlockchainEventCount] = useState<number>();
  const [blockchainEventErrorCount, setBlockchainEventErrorCount] =
    useState<number>(0);

  // Medium cards
  // Events histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();
  // Blockchain Events
  const [blockchainEvents, setBlockchainEvents] =
    useState<IBlockchainEvent[]>();
  // View Blockchain Events
  const [viewBlockchainEvent, setViewBlockchainEvent] =
    useState<IBlockchainEvent>();

  const smallCards: ISmallCard[] = [
    {
      header: t('blockchainOperations'),
      numErrors: blockchainOpErrorCount,
      data: [{ header: t('total'), data: blockchainOpCount }],
    },
    {
      header: t('blockchainTransactions'),
      numErrors: blockchainTxErrorCount,
      data: [{ header: t('total'), data: blockchainTxCount }],
    },
    {
      header: t('blockchainEvents'),
      numErrors: blockchainEventErrorCount,
      data: [{ header: t('total'), data: blockchainEventCount }],
    },
    {
      header: t('TBD'),
      numErrors: 0,
      data: [{ header: t('total'), data: 0 }],
    },
  ];

  // Small Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;

    Promise.all([
      // Blockchain Operations
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}`
      ),
      // Blockchain Transactions
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.transactions}${qParams}`
      ),
      // Blockchain Events
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.blockchainEvents}${qParams}`
      ),
    ])
      .then(
        ([
          // Blockchain Operations
          ops,
          // Blockchain Transactions
          txs,
          // Blockchain Events
          events,
        ]: IGenericPagedResponse[] | any[]) => {
          // Operations
          setBlockchainOpCount(ops.total);
          // Transactions
          setBlockchainTxCount(txs.total);
          // Events
          setBlockchainEventCount(events.total);
        }
      )
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const mediumCards: IMediumCard[] = [
    {
      headerText: t('recentBlockchainEvents'),
      headerComponent: (
        <IconButton onClick={() => navigate(EVENTS_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <Histogram
          colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
          data={eventHistData}
          indexBy="timestamp"
          keys={[
            EventCategoryEnum.BLOCKCHAIN,
            EventCategoryEnum.MESSAGES,
            EventCategoryEnum.TOKENS,
          ]}
          includeLegend={true}
          emptyText={t('noBlockchainEvents')}
          isEmpty={isHistogramEmpty(
            eventHistData ?? [],
            Object.keys(EventCategoryEnum)
          )}
        ></Histogram>
      ),
    },
    {
      headerText: t('contractInterfaces'),
      headerComponent: (
        <IconButton onClick={() => navigate(INTERFACES_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <List sx={{ width: '100%' }}>
          <ListItem sx={{ color: 'text.secondary', fontSize: 10 }}>
            <ListItemText primary={t('id')} />
            <ListItemText primary={t('api')} />
            <ListItemText primary={t('status')} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Interface ID/Name" />
            <ListItemText primary="3" />
            <Chip label="test" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Interface ID/Name" />
            <ListItemText primary="3" />
            <Chip label="test" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Interface ID/Name" />
            <ListItemText primary="3" />
            <Chip label="test" />
          </ListItem>
        </List>
      ),
    },
    {
      headerText: t('contractSubscriptions'),
      headerComponent: (
        <IconButton onClick={() => navigate(SUBSCRIPTIONS_PATH)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <List sx={{ width: '100%' }}>
          <ListItem sx={{ color: 'text.secondary', fontSize: 10 }}>
            <ListItemText primary={t('name')} />
            <ListItemText primary={t('created')} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Subscription ID/Name" />
            <ListItemText primary="01/24/2022" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Subscription ID/Name" />
            <ListItemText primary="01/24/2022" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Subscription ID/Name" />
            <ListItemText primary="01/24/2022" />
          </ListItem>
        </List>
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.contractInterfaces}`
    )
      .then((interfaces: ITokenPool[]) => {
        // TODO: Set correctly
        // setTokenPools(interfaces);
      })
      .catch((err) => {
        reportFetchError(err);
      });
    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.contractSubscriptions}`
    )
      .then((subs: ITokenAccount[]) => {
        // TODO: Set correctly
        // setTokenAccounts(subs);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Events,
        createdFilterObject.filterTime,
        currentTime,
        BucketCountEnum.Small
      )}`
    )
      .then((histTypes: IMetric[]) => {
        setEventHistData(makeEventHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const beColHeaders = [
    t('sequence'),
    t('name'),
    t('id'),
    t('address'),
    t('timestamp'),
  ];
  const beRecords: IDataTableRecord[] | undefined = blockchainEvents?.map(
    (be) => ({
      key: be.id,
      columns: [
        {
          value: <Typography>{be.sequence}</Typography>,
        },
        {
          value: <Typography>{be.name}</Typography>,
        },
        {
          value: <HashPopover shortHash={true} address={be.id}></HashPopover>,
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={be.info?.address ?? ''}
            ></HashPopover>
          ),
        },
        { value: dayjs(be.timestamp).format('MM/DD/YYYY h:mm A') },
      ],
      onClick: () => setViewBlockchainEvent(be),
    })
  );

  // Recent blockchain events
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.blockchainEvents}?limit=5${createdFilterObject.filterString}`
    )
      .then((blockchainEvents: IBlockchainEvent[]) => {
        setBlockchainEvents(blockchainEvents);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  return (
    <>
      <Header title={t('dashboard')} subtitle={t('blockchain')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          {/* Small Cards */}
          <Grid
            spacing={DEFAULT_SPACING}
            container
            item
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {smallCards.map((card) => {
              return (
                <Grid
                  key={card.header}
                  xs={DEFAULT_PADDING}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  container
                  item
                >
                  <SmallCard card={card} />
                </Grid>
              );
            })}
          </Grid>
          {/* Medium Cards */}
          <Grid
            spacing={DEFAULT_SPACING}
            container
            justifyContent="center"
            alignItems="flex-start"
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {mediumCards.map((card) => {
              return (
                <Grid
                  key={card.headerText}
                  direction="column"
                  justifyContent="center"
                  container
                  item
                  xs={4}
                >
                  <MediumCard card={card} position="flex-start" />
                </Grid>
              );
            })}
          </Grid>
          {/* Blockchain Events */}
          {!blockchainEvents ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : blockchainEvents.length ? (
            <DataTable
              header={t('recentBlockchainEvents')}
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={beRecords}
              columnHeaders={beColHeaders}
            />
          ) : (
            <DataTableEmptyState
              message={t('noBlockchainEvents')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </Grid>
      {/* TODO: Add slideover */}
      {/* {viewBlockchainEvent && (
        <TransferSlide
          transfer={viewBlockchainEvent}
          open={!!viewBlockchainEvent}
          onClose={() => {
            setViewTransfer(undefined);
          }}
        />
      )} */}
    </>
  );
};
