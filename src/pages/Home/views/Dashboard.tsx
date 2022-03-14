import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, IconButton, List, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CardEmptyState } from '../../../components/Cards/CardEmptyState';
import { MediumCard } from '../../../components/Cards/MediumCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { TableCard } from '../../../components/Cards/TableCard';
import { TableCardItem } from '../../../components/Cards/TableCardItem';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { NetworkMap } from '../../../components/NetworkMap/NetworkMap';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { EventSlide } from '../../../components/Slides/EventSlide';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  FF_EVENTS_CATEGORY_MAP,
  FF_NAV_PATHS,
  FF_OP_CATEGORY_MAP,
  ICreatedFilter,
  IDataWithHeader,
  IEvent,
  IGenericPagedResponse,
  IMediumCard,
  IMetric,
  INode,
  ISmallCard,
  ITableCard,
  ITransaction,
  OpCategoryEnum,
} from '../../../interfaces';
import { FF_Paths } from '../../../interfaces/constants';
import { FF_TX_CATEGORY_MAP } from '../../../interfaces/enums/transactionTypes';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import {
  fetchCatcher,
  makeEventHistogram,
  makeMultipleQueryParams,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';

export const HomeDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const {
    createdFilter,
    lastEvent,
    nodeID,
    nodeName,
    orgID,
    orgName,
    selectedNamespace,
  } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const [viewTx, setViewTx] = useState<ITransaction>();
  const [viewEvent, setViewEvent] = useState<IEvent>();

  // Small cards
  // Blockchain
  const [blockchainTxCount, setBlockchainTxCount] = useState<number>();
  const [blockchainEventCount, setBlockchainEventCount] = useState<number>();
  // Messages
  const [messagesTxCount, setMessagesTxCount] = useState<number>();
  const [messagesEventCount, setMessagesEventCount] = useState<number>();
  // Tokens
  const [tokenTransfersCount, setTokenTransfersCount] = useState<number>();
  const [tokenMintCount, setTokenMintcount] = useState<number>();
  const [tokenBurnCount, setTokenBurnCount] = useState<number>();
  // Operations
  const [blockchainOperationsCount, setBlockchainOperationsCount] =
    useState<number>();
  const [messageOperationsCount, setMessageOperationsCount] =
    useState<number>();
  const [tokensOperationsCount, setTokensOperationsCount] = useState<number>();
  const [operationsErrorCount, setOperationsErrorCount] = useState<number>();

  // Medium cards
  // Event types histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();
  // My Node
  const [myNode, setMyNode] = useState<INode>();
  // Table cards
  const [recentEventTxs, setRecentEventTxs] = useState<IEvent[]>();
  const [recentEvents, setRecentEvents] = useState<IEvent[]>();

  const smallCards: ISmallCard[] = [
    {
      header: t('blockchain'),
      data: [
        { header: t('tx'), data: blockchainTxCount },
        { header: t('events'), data: blockchainEventCount },
      ],
      clickPath: FF_NAV_PATHS.blockchainPath(selectedNamespace),
    },
    {
      header: t('messages'),
      data: [
        { header: t('tx'), data: messagesTxCount },
        { header: t('events'), data: messagesEventCount },
      ],
      clickPath: FF_NAV_PATHS.offchainMessagesPath(selectedNamespace),
    },
    {
      header: t('tokens'),
      data: [
        { header: t('transfers'), data: tokenTransfersCount },
        { header: t('mint'), data: tokenMintCount },
        { header: t('burn'), data: tokenBurnCount },
      ],
      clickPath: FF_NAV_PATHS.tokensTransfersPath(selectedNamespace),
    },
    {
      header: t('operations'),
      numErrors: operationsErrorCount,
      data: [
        { header: t('blockchain'), data: blockchainOperationsCount },
        { header: t('messages'), data: messageOperationsCount },
        { header: t('tokens'), data: tokensOperationsCount },
      ],
      clickPath: FF_NAV_PATHS.activityOpPath(selectedNamespace),
    },
  ];
  // Small Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;

    Promise.all([
      // Blockchain
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.transactions}${qParams}&blockchainids=!`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.blockchainEvents}${qParams}`
      ),
      // Messages
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messages}${qParams}&type=broadcast`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.messages}${qParams}&type=private`
      ),
      // Tokens
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=transfer`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=mint`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransfers}${qParams}&type=burn`
      ),
      // Operations
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.operations
        }${qParams}${makeMultipleQueryParams(
          FF_OP_CATEGORY_MAP,
          OpCategoryEnum.BLOCKCHAIN,
          'type'
        )}`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.operations
        }${qParams}${makeMultipleQueryParams(
          FF_OP_CATEGORY_MAP,
          OpCategoryEnum.MESSAGES,
          'type'
        )}`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.operations
        }${qParams}${makeMultipleQueryParams(
          FF_OP_CATEGORY_MAP,
          OpCategoryEnum.TOKENS,
          'type'
        )}`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&error=!`
      ),
    ])
      .then(
        ([
          blockchainTx,
          blockchainEvents,
          msgsTx,
          msgsEvents,
          tokensTransfer,
          tokensMint,
          tokensBurn,
          opsBlockchain,
          opsMessages,
          opsTokens,
          opsErrors,
        ]: IGenericPagedResponse[]) => {
          // Blockchain
          setBlockchainTxCount(blockchainTx.total);
          setBlockchainEventCount(blockchainEvents.total);
          // Messages
          setMessagesEventCount(msgsTx.total);
          setMessagesTxCount(msgsEvents.total);
          // Tokens
          setTokenTransfersCount(tokensTransfer.total);
          setTokenMintcount(tokensMint.total);
          setTokenBurnCount(tokensBurn.total);
          // Operations
          setBlockchainOperationsCount(opsBlockchain.total);
          setMessageOperationsCount(opsMessages.total);
          setTokensOperationsCount(opsTokens.total);
          setOperationsErrorCount(opsErrors.total);
        }
      )
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const myNodeDetailsList: IDataWithHeader[] = [
    {
      header: t('nodeName'),
      data: nodeName,
    },
    {
      header: t('nodeID'),
      data: nodeID,
    },
    {
      header: t('orgName'),
      data: orgName,
    },
    {
      header: t('orgID'),
      data: orgID,
    },
    {
      header: t('profile'),
      data: myNode?.profile?.id,
    },
    {
      header: t('profileEndpoint'),
      data: myNode?.profile?.endpoint,
    },
  ];

  const mediumCards: IMediumCard[] = [
    {
      headerComponent: (
        <IconButton
          onClick={() =>
            navigate(FF_NAV_PATHS.activityEventsPath(selectedNamespace))
          }
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('activity'),
      component: (
        <Histogram
          height={'100%'}
          colors={makeColorArray(FF_EVENTS_CATEGORY_MAP)}
          data={eventHistData}
          indexBy="timestamp"
          keys={makeKeyArray(FF_EVENTS_CATEGORY_MAP)}
          emptyText={t('noActivity')}
          isEmpty={isHistogramEmpty(eventHistData ?? [])}
          includeLegend={true}
        />
      ),
    },
    {
      headerComponent: (
        <IconButton
          onClick={() => navigate(FF_NAV_PATHS.networkPath(selectedNamespace))}
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('networkMap'),
      component: <NetworkMap></NetworkMap>,
    },
    {
      headerComponent: (
        <IconButton
          onClick={() => navigate(FF_NAV_PATHS.myNodePath(selectedNamespace))}
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('myNode'),
      component: (
        <Grid container item>
          {myNodeDetailsList.map((data, idx) => (
            <React.Fragment key={idx}>
              <Grid item xs={6} pb={2}>
                <Typography pb={1} variant="body2">
                  {data.header}
                </Typography>
                <HashPopover address={data.data?.toString() ?? ''} />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      ),
    },
  ];

  // Medium Card UseEffect
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
        setEventHistData([]);
        reportFetchError(err);
      });

    fetchCatcher(`${FF_Paths.apiPrefix}/${FF_Paths.networkNodeById(nodeID)}`)
      .then((nodeRes: INode) => {
        setMyNode(nodeRes);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter, nodeID]);

  const tableCards: ITableCard[] = [
    // Recently submitted Transactions
    {
      headerComponent: (
        <IconButton
          onClick={() =>
            navigate(FF_NAV_PATHS.activityTxPath(selectedNamespace))
          }
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('myRecentTransactions'),
      component: (
        <List
          disablePadding
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {!recentEventTxs ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : recentEventTxs.length ? (
            recentEventTxs.map((event, idx) => (
              <div key={idx} onClick={() => setViewTx(event.transaction)}>
                <TableCardItem
                  borderColor={FF_EVENTS_CATEGORY_MAP[event.type].color}
                  key={idx}
                  date={dayjs(event.created).format('MM/DD/YYYY h:mm A')}
                  header={t(
                    FF_TX_CATEGORY_MAP[event?.transaction?.type ?? ''].nicename
                  )}
                  status={event.reference}
                  subText={t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
                />
              </div>
            ))
          ) : (
            <CardEmptyState text={t('noTransactions')}></CardEmptyState>
          )}
        </List>
      ),
    },
    // Recent Network Events
    {
      headerComponent: (
        <IconButton
          onClick={() =>
            navigate(FF_NAV_PATHS.activityEventsPath(selectedNamespace))
          }
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('recentNetworkEvents'),
      component: (
        <List
          disablePadding
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {!recentEvents ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : recentEvents?.length ? (
            recentEvents.map((event, idx) => (
              <div key={idx} onClick={() => setViewEvent(event)}>
                <TableCardItem
                  borderColor={FF_EVENTS_CATEGORY_MAP[event.type].color}
                  key={idx}
                  date={dayjs(event.created).format('MM/DD/YYYY h:mm A')}
                  header={t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
                  status={event.reference}
                  subText={t(FF_EVENTS_CATEGORY_MAP[event.type].nicename)}
                />
              </div>
            ))
          ) : (
            <CardEmptyState text={t('noEvents')}></CardEmptyState>
          )}
        </List>
      ),
    },
  ];

  // Table Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?limit=7${createdFilterObject.filterString}`;

    Promise.all([
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}&type=transaction_submitted&fetchreferences=true`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}&type=!transaction_submitted`
      ),
    ])
      .then(([recentEventTxs, recentEvents]) => {
        setRecentEventTxs(recentEventTxs);
        setRecentEvents(recentEvents);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  return (
    <>
      <Header title={'Dashboard'} subtitle={'Home'}></Header>
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
            alignItems="center"
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {mediumCards.map((card) => {
              return (
                <Grid
                  key={card.headerText}
                  direction="column"
                  alignItems="center"
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
          {/* Tables */}
          <Grid
            spacing={DEFAULT_SPACING}
            container
            item
            direction="row"
            pb={DEFAULT_PADDING}
          >
            {tableCards.map((card, idx) => {
              return (
                <Grid
                  key={idx}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  container
                  item
                  xs={6}
                >
                  <TableCard key={idx} card={card} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      {viewTx && (
        <TransactionSlide
          transaction={viewTx}
          open={!!viewTx}
          onClose={() => {
            setViewTx(undefined);
          }}
        />
      )}
      {viewEvent && (
        <EventSlide
          event={viewEvent}
          open={!!viewEvent}
          onClose={() => {
            setViewEvent(undefined);
          }}
        />
      )}
    </>
  );
};