import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, IconButton, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EmptyStateCard } from '../../../components/Cards/EmptyStateCard';
import { EventCardWrapper } from '../../../components/Cards/EventCards/EventCardWrapper';
import { FireFlyCard } from '../../../components/Cards/FireFlyCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { Histogram } from '../../../components/Charts/Histogram';
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
  IFireFlyCard,
  IGenericPagedResponse,
  IMetric,
  INode,
  ISmallCard,
  ITransaction,
  OpCategoryEnum,
} from '../../../interfaces';
import { FF_Paths } from '../../../interfaces/constants';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import {
  fetchCatcher,
  getCreatedFilter,
  makeEventHistogram,
  makeMultipleQueryParams,
} from '../../../utils';
import {
  isHistogramEmpty,
  makeColorArray,
  makeKeyArray,
} from '../../../utils/charts';
import { isEventType, WsEventTypes } from '../../../utils/wsEvents';

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
  const [isMounted, setIsMounted] = useState(false);
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
  // Last event tracking
  const [numNewEvents, setNumNewEvents] = useState(0);
  const [lastRefreshTime, setLastRefresh] = useState<string>(
    new Date().toISOString()
  );

  useEffect(() => {
    isMounted &&
      isEventType(lastEvent, WsEventTypes.EVENT) &&
      setNumNewEvents(numNewEvents + 1);
  }, [lastEvent]);

  const refreshData = () => {
    setNumNewEvents(0);
    setLastRefresh(new Date().toString());
  };

  useEffect(() => {
    setIsMounted(true);
    setNumNewEvents(0);
    return () => {
      setIsMounted(false);
    };
  }, []);

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
      errorLink: FF_NAV_PATHS.activityOpErrorPath(selectedNamespace),
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

    isMounted &&
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
            if (isMounted) {
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
          }
        )
        .catch((err) => {
          reportFetchError(err);
        })
        .finally(() => numNewEvents !== 0 && setNumNewEvents(0));
  }, [selectedNamespace, createdFilter, lastRefreshTime, isMounted]);

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

  const mediumCards: IFireFlyCard[] = [
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

    if (isMounted) {
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
    }
  }, [
    selectedNamespace,
    createdFilter,
    lastRefreshTime,
    createdFilter,
    nodeID,
    isMounted,
  ]);

  const tableCards: IFireFlyCard[] = [
    // Recently submitted Transactions
    {
      headerText: t('myRecentTransactions'),
      headerComponent: (
        <IconButton
          onClick={() =>
            navigate(FF_NAV_PATHS.activityTimelinePath(selectedNamespace))
          }
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <>
          {!recentEventTxs ? (
            <FFCircleLoader color="warning" />
          ) : recentEventTxs.length === 0 ? (
            <EmptyStateCard text={t('noRecentTransactions')} />
          ) : (
            <Grid
              container
              direction="column"
              item
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              {recentEventTxs.map((event, idx) => (
                <Grid
                  item
                  container
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  key={idx}
                >
                  <EventCardWrapper
                    onHandleViewEvent={(event: IEvent) => setViewEvent(event)}
                    onHandleViewTx={(tx: ITransaction) => setViewTx(tx)}
                    link={FF_NAV_PATHS.activityTxDetailPath(
                      selectedNamespace,
                      event.tx
                    )}
                    {...{ event }}
                  />
                  <Grid sx={{ padding: '1px' }} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ),
    },
    // Recent Network Events
    {
      headerText: t('recentNetworkEvents'),
      headerComponent: (
        <IconButton
          onClick={() =>
            navigate(FF_NAV_PATHS.activityTimelinePath(selectedNamespace))
          }
        >
          <ArrowForwardIcon />
        </IconButton>
      ),
      component: (
        <>
          {!recentEvents ? (
            <FFCircleLoader color="warning" />
          ) : recentEvents.length === 0 ? (
            <EmptyStateCard text={t('noRecentNetworkEvents')} />
          ) : (
            <Grid
              container
              direction="column"
              item
              alignItems="flex-start"
              justifyContent="flex-start"
            >
              {recentEvents.map((event, idx) => (
                <Grid
                  item
                  container
                  alignItems="flex-start"
                  justifyContent="flex-start"
                  key={idx}
                >
                  <EventCardWrapper
                    onHandleViewEvent={(event: IEvent) => setViewEvent(event)}
                    onHandleViewTx={(tx: ITransaction) => setViewTx(tx)}
                    link={FF_NAV_PATHS.activityTxDetailPath(
                      selectedNamespace,
                      event.tx
                    )}
                    linkState={{ state: event }}
                    {...{ event }}
                  />
                  <Grid sx={{ padding: '1px' }} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ),
    },
  ];
  // Table Card UseEffect
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
    const qParams = `?limit=25${createdFilterObject.filterString}`;

    isMounted &&
      Promise.all([
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}&type=transaction_submitted&fetchreferences=true`
        ),
        fetchCatcher(
          `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}&type=!transaction_submitted`
        ),
      ])
        .then(([recentEventTxs, recentEvents]) => {
          if (isMounted) {
            setRecentEventTxs(recentEventTxs);
            setRecentEvents(recentEvents);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [selectedNamespace, lastRefreshTime, , createdFilter, isMounted]);

  return (
    <>
      <Header
        title={'Dashboard'}
        subtitle={'Home'}
        onRefresh={refreshData}
        numNewEvents={numNewEvents}
      ></Header>
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
                  <FireFlyCard card={card} position="flex-start" />
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
                  <FireFlyCard position="flex-start" key={idx} card={card} />
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
