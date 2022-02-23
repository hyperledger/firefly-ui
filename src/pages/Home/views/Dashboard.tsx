import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CircularProgress, Grid, List, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useContext, useEffect, useState } from 'react';
import { MediumCard } from '../../../components/Cards/MediumCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { TableCard } from '../../../components/Cards/TableCard';
import { TableCardItem } from '../../../components/Cards/TableCardItem';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { NetworkMap } from '../../../components/NetworkMap/NetworkMap';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  ICreatedFilter,
  IEvent,
  IGenericPagedResponse,
  IMediumCard,
  IMetric,
  ISmallCard,
  ITableCard,
} from '../../../interfaces';
import { FF_Paths } from '../../../interfaces/constants';
import { DEFAULT_PADDING, DEFAULT_SPACING, FFColors } from '../../../theme';
import { fetchCatcher } from '../../../utils';

export const HomeDashboard: () => JSX.Element = () => {
  const { createdFilter, lastEvent, orgName, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
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
  const [eventTypesData, setEventTypesData] = useState<BarDatum[]>([]);
  // Table cards
  const [recentTxs, setRecentTxs] = useState<IEvent[]>();
  const [recentEvents, setRecentEvents] = useState<IEvent[]>();

  const smallCards: ISmallCard[] = [
    {
      header: 'Blockchain',
      numErrors: blockchainErrorCount,
      data: [
        { header: 'Tx', data: blockchainTxCount },
        { header: 'Events', data: blockchainEventCount },
      ],
    },
    {
      header: 'Off-Chain',
      // TODO: Figure out error API call
      numErrors: offchainErrorCount,
      data: [
        { header: 'In', data: offchainInCount },
        { header: 'Out', data: offchainOutCount },
      ],
    },
    {
      header: 'Messages',
      // TODO: Figure out error API call
      numErrors: messagesErrorCount,
      data: [
        { header: 'Tx', data: messagesTxCount },
        { header: 'Events', data: messagesEventCount },
      ],
    },
    {
      header: 'Tokens',
      numErrors: tokenErrorCount,
      data: [
        { header: 'Transfers', data: tokenTransfersCount },
        { header: 'Mint', data: tokenMintCount },
        { header: 'Burn', data: tokenBurnCount },
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

  const mediumCards: IMediumCard[] = [
    {
      headerComponent: <ArrowForwardIcon />,
      headerText: `My Node - ${orgName}`,
      component: <Typography>Placeholder</Typography>,
    },
    {
      headerComponent: <ArrowForwardIcon />,
      headerText: 'Network Map',
      component: <NetworkMap></NetworkMap> ?? <CircularProgress />,
    },
    {
      headerComponent: <ArrowForwardIcon />,
      headerText: 'Event Types',
      component: eventTypesData?.length ? (
        <Histogram
          colors={[FFColors.Yellow]}
          data={eventTypesData}
          indexBy="timestamp"
          keys={['events']}
        ></Histogram>
      ) : (
        <CircularProgress />
      ),
    },
  ];

  // Medium Card UseEffect
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        'events'
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=12`
    )
      .then((eventBuckets: IMetric[]) => {
        setEventTypesData(
          eventBuckets.map((bucket) => {
            return {
              events: bucket.count,
              eventsColor: FFColors.Yellow,
              timestamp: bucket.timestamp,
            } as BarDatum;
          })
        );
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

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

  const tableCards: ITableCard[] = [
    {
      headerComponent: <ArrowForwardIcon />,
      headerText: t('myRecentTransactions'),
      component: (
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {recentTxs?.length ? (
            recentTxs.map((tx, idx) => (
              <div key={idx} onClick={() => setViewEvent(tx)}>
                <TableCardItem
                  date={dayjs(tx.created).format('MM/DD/YYYY h:mm A')}
                  header={tx.type}
                  status={tx.reference}
                  subText={tx.type}
                />
              </div>
            ))
          ) : (
            <CircularProgress />
          )}
        </List>
      ),
    },
    {
      headerComponent: <ArrowForwardIcon />,
      headerText: 'Recent Network Events',
      component: (
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {recentEvents?.length ? (
            recentEvents.map((tx, idx) => (
              <div key={idx} onClick={() => setViewEvent(tx)}>
                <TableCardItem
                  date={dayjs(tx.created).format('MM/DD/YYYY h:mm A')}
                  header={tx.type}
                  status={tx.reference}
                  subText={tx.type}
                />
              </div>
            ))
          ) : (
            <CircularProgress />
          )}
        </List>
      ),
    },
  ];

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
                  <MediumCard card={card} />
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
        <TransactionSlide
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
