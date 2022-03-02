import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid, IconButton, List, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
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
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  ACTIVITY_PATH,
  BucketCollectionEnum,
  BucketCountEnum,
  EventKeyEnum,
  ICreatedFilter,
  IDataWithHeader,
  IEvent,
  IGenericPagedResponse,
  IMediumCard,
  IMetricType,
  INode,
  ISmallCard,
  ITableCard,
  MY_NODES_PATH,
  NAMESPACES_PATH,
  NETWORK_PATH,
  TRANSACTIONS_PATH,
} from '../../../interfaces';
import { FF_Paths } from '../../../interfaces/constants';
import { DEFAULT_PADDING, DEFAULT_SPACING, FFColors } from '../../../theme';
import {
  fetchCatcher,
  isEventHistogramEmpty,
  makeEventHistogram,
} from '../../../utils';

export const HomeDashboard: () => JSX.Element = () => {
  const { t } = useTranslation();
  const {
    createdFilter,
    identity,
    lastEvent,
    nodeID,
    nodeName,
    orgID,
    orgName,
    selectedNamespace,
  } = useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const eventsPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${ACTIVITY_PATH}`;
  const myNodePath = `/${NAMESPACES_PATH}/${selectedNamespace}/${MY_NODES_PATH}`;
  const networkPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${NETWORK_PATH}`;
  const transactionsPath = `/${NAMESPACES_PATH}/${selectedNamespace}/${ACTIVITY_PATH}/${TRANSACTIONS_PATH}`;
  const [viewEvent, setViewEvent] = useState<IEvent | undefined>();
  // Small cards
  // Blockchain
  const [blockchainTxCount, setBlockchainTxCount] = useState<number>();
  const [blockchainEventCount, setBlockchainEventCount] = useState<number>();
  const [blockchainErrorCount, setBlockchainErrorCount] = useState<number>(0);
  // Off-Chain
  const [offchainInCount, setOffchainInCount] = useState<number>();
  const [offchainOutCount, setOffchainOutCount] = useState<number>();
  const [offchainErrorCount, setOffchainErrorCount] = useState<number>(0);
  // Messages
  const [messagesTxCount, setMessagesTxCount] = useState<number>();
  const [messagesEventCount, setMessagesEventCount] = useState<number>();
  const [messagesErrorCount, setMessagesErrorCount] = useState<number>(0);
  // Tokens
  const [tokenTransfersCount, setTokenTransfersCount] = useState<number>();
  const [tokenMintCount, setTokenMintcount] = useState<number>();
  const [tokenBurnCount, setTokenBurnCount] = useState<number>();
  const [tokenErrorCount, setTokenErrorCount] = useState<number>(0);
  // Medium cards
  // Event types histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();
  // My Node
  const [myNode, setMyNode] = useState<INode>();
  // Table cards
  const [recentTxs, setRecentTxs] = useState<IEvent[]>();
  const [recentEvents, setRecentEvents] = useState<IEvent[]>();

  const smallCards: ISmallCard[] = [
    {
      header: t('blockchain'),
      numErrors: blockchainErrorCount,
      data: [
        { header: t('tx'), data: blockchainTxCount },
        { header: t('events'), data: blockchainEventCount },
      ],
    },
    {
      header: t('offChain'),
      // TODO: Figure out error API call
      numErrors: offchainErrorCount,
      data: [
        { header: t('in'), data: offchainInCount },
        { header: t('out'), data: offchainOutCount },
      ],
    },
    {
      header: t('messages'),
      // TODO: Figure out error API call
      numErrors: messagesErrorCount,
      data: [
        { header: t('tx'), data: messagesTxCount },
        { header: t('events'), data: messagesEventCount },
      ],
    },
    {
      header: t('tokens'),
      numErrors: tokenErrorCount,
      data: [
        { header: t('transfers'), data: tokenTransfersCount },
        { header: t('mint'), data: tokenMintCount },
        { header: t('burn'), data: tokenBurnCount },
      ],
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
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&type=blockchain_batch_pin&type=blockchain_invoke&status=Failed`
      ),
      // TODO: Figure out API calls
      // Off-Chain
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}`
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
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.operations}${qParams}&type=token_create_pool&type=token_activate_pool&type=token_transfer&status=Failed`
      ),
    ])
      .then(
        ([
          blockchainTx,
          blockchainEvents,
          blockchainErrors,
          offChainIn,
          offChainOut,
          msgsTx,
          msgsEvents,
          tokensTransfer,
          tokensMint,
          tokensBurn,
          tokenErrors,
        ]: IGenericPagedResponse[]) => {
          setBlockchainTxCount(blockchainTx.total);
          setBlockchainEventCount(blockchainEvents.total);
          setBlockchainErrorCount(blockchainErrors.total);

          // TODO: Set values once API calls done
          setOffchainInCount(0);
          setOffchainOutCount(0);

          setMessagesEventCount(msgsTx.total);
          setMessagesTxCount(msgsEvents.total);

          setTokenTransfersCount(tokensTransfer.total);
          setTokenMintcount(tokensMint.total);
          setTokenBurnCount(tokensBurn.total);
          setTokenErrorCount(tokenErrors.total);
        }
      )
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const myNodeDetailsList: IDataWithHeader[] = [
    {
      header: t('identity'),
      data: identity,
    },
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
      header: t('dxPeer'),
      data: myNode?.dx.peer,
    },
    {
      header: t('dxEndpoint'),
      data: myNode?.dx.endpoint.endpoint,
    },
  ];

  const mediumCards: IMediumCard[] = [
    {
      headerComponent: (
        <IconButton onClick={() => navigate(eventsPath)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('activity'),
      component: !eventHistData ? (
        <FFCircleLoader color="warning"></FFCircleLoader>
      ) : isEventHistogramEmpty(eventHistData) ? (
        <CardEmptyState text={t('noEvents')}></CardEmptyState>
      ) : (
        <Histogram
          colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
          data={eventHistData}
          indexBy="timestamp"
          keys={[
            EventKeyEnum.BLOCKCHAIN,
            EventKeyEnum.MESSAGES,
            EventKeyEnum.TOKENS,
          ]}
          includeLegend={true}
        ></Histogram>
      ),
    },
    {
      headerComponent: (
        <IconButton onClick={() => navigate(networkPath)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('networkMap'),
      component: <NetworkMap></NetworkMap>,
    },
    {
      headerComponent: (
        <IconButton onClick={() => navigate(myNodePath)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: t('myNode'),
      component: (
        <Grid container item>
          {myNodeDetailsList.map((data, idx) => (
            <>
              <Grid xs={idx === 0 ? 12 : 6} pb={2}>
                <Typography pb={1} variant="body2">
                  {data.header}
                </Typography>
                <HashPopover
                  key={idx}
                  fullLength={idx === 0}
                  address={data.data?.toString() ?? ''}
                />
              </Grid>
            </>
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
        BucketCollectionEnum.Events
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=${BucketCountEnum.Small}`
    )
      .then((histTypes: IMetricType[]) => {
        setEventHistData(makeEventHistogram(histTypes));
      })
      .catch((err) => {
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
    {
      headerComponent: (
        <IconButton onClick={() => navigate(transactionsPath)}>
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
          {!recentTxs ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : recentTxs.length ? (
            recentTxs.map((tx, idx) => (
              <div key={idx} onClick={() => setViewEvent(tx)}>
                <TableCardItem
                  date={dayjs(tx.created).format('MM/DD/YYYY h:mm A')}
                  header={tx.type.toLocaleUpperCase()}
                  status={tx.reference}
                  subText={tx.type}
                />
              </div>
            ))
          ) : (
            <CardEmptyState text={t('noEvents')}></CardEmptyState>
          )}
        </List>
      ),
    },
    {
      headerComponent: (
        <IconButton onClick={() => navigate(transactionsPath)}>
          <ArrowForwardIcon />
        </IconButton>
      ),
      headerText: 'Recent Network Events',
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
            recentEvents.map((tx, idx) => (
              <div key={idx} onClick={() => setViewEvent(tx)}>
                <TableCardItem
                  date={dayjs(tx.created).format('MM/DD/YYYY h:mm A')}
                  header={tx.type.toLocaleUpperCase()}
                  status={tx.reference}
                  subText={tx.type}
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
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}&type=transaction_submitted`
      ),
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.events}${qParams}&type=!transaction_submitted`
      ),
    ])
      .then(([recentTxs, recentEvents]) => {
        setRecentTxs(recentTxs);
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
            {tableCards.map((card) => {
              return (
                <Grid
                  key={card.headerText}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  container
                  item
                  xs={6}
                >
                  <TableCard card={card} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
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
