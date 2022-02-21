import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Grid, List, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IMediumCard,
  ISmallCard,
  ITableCard,
  ITableCardItem,
} from '../../../components/Cards/CardInterfaces';
import { MediumCard } from '../../../components/Cards/MediumCard';
import { SmallCard } from '../../../components/Cards/SmallCard';
import { TableCard } from '../../../components/Cards/TableCard';
import { TableCardItem } from '../../../components/Cards/TableCardItem';
import { Histogram } from '../../../components/Charts/Histogram';
import { ICreatedFilter } from '../../../components/Filters/FilterInterfaces';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { NetworkMap } from '../../../components/NetworkMap/NetworkMap';
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { Header } from '../../../components/Header';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';

const smallCards: ISmallCard[] = [
  {
    header: 'Blockchain',
    numErrors: 3,
    data: [
      { header: 'Tx', data: 231 },
      { header: 'Events', data: 652 },
    ],
  },
  {
    header: 'Off-Chain',
    data: [
      { header: 'In', data: 1126 },
      { header: 'Out', data: 754 },
    ],
  },
  {
    header: 'Messages',
    data: [
      { header: 'Tx', data: 860 },
      { header: 'Events', data: 652 },
    ],
  },
  {
    header: 'Tokens',
    numErrors: 2,
    data: [
      { header: 'Transfers', data: 59 },
      { header: 'Mint', data: 18 },
      { header: 'Burn', data: 12 },
    ],
  },
];

const mediumCards: IMediumCard[] = [
  {
    headerComponent: <ArrowForwardIcon />,
    headerText: 'My Node - [Node Name]',
    component: <Typography>Placeholder</Typography>,
  },
  {
    headerComponent: undefined,
    headerText: 'Network Map',
    component: <Typography>Placeholder</Typography>,
  },
  {
    headerComponent: undefined,
    headerText: 'Event Types',
    component: <Typography>Placeholder</Typography>,
  },
];

enum TXStatus {
  Succeeded = 'Succeeded',
  Pending = 'Pending',
  Error = 'Error',
}

const recentSubmittedTxs: ITableCardItem[] = [
  {
    header: 'To=Org2,Org3 BatchSize=1',
    status: TXStatus.Pending,
    subText: 'Private Message Batch',
    date: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
  },
  {
    header: 'From=0xabc To=0xbcd',
    status: '0x39b9af6647d97f0ce3c9dd2e60fc6c2dbea610cc',
    subText: 'Token Transfer',
    date: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
  },
  {
    header: 'Connector=ERC20, Address=0x',
    status: TXStatus.Pending,
    subText: 'Private Message Batch',
    date: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
  },
  {
    header: 'To=Org2,Org3 BatchSize=1',
    status: TXStatus.Pending,
    subText: 'Private Message Batch',
    date: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
  },
  {
    header: 'From=0xabc To=0xbcd',
    status: '0xe16766af6caeaedbb3584ae6d39436d00fa835fd',
    subText: 'Token Transfer',
    date: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
  },
  {
    header: 'Connector=ERC20, Address=0x',
    status: TXStatus.Pending,
    subText: 'Private Message Batch',
    date: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
  },
  {
    header: 'To=Org2,Org3 BatchSize=1',
    status: TXStatus.Pending,
    subText: 'Private Message Batch',
    date: dayjs(Date.now()).format('MM/DD/YYYY h:mm A'),
  },
];

export const HomeDashboard: () => JSX.Element = () => {
  const { namespace } = useParams();
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const [filterString, setFilterString] = useState('');
  const [viewData, setViewData] = useState<boolean | undefined>();

  // Blockchain
  const [blockchainTxCount, setBlockchainTxCount] = useState<number>();
  const [blockchainEventCount, setBlockchainEventCount] = useState<number>();
  const [blockchainErrorCount, setBlockchainErrorCount] = useState<number>();
  // Off-Chain
  const [offchainInCount, setOffchainInCount] = useState<number>();
  const [offchainOutCount, setOffchainOutCount] = useState<number>();
  const [offchainErrorCount, setOffchainErrorCount] = useState<number>();
  // Messages
  const [messagesTxCount, setMessagesTxCount] = useState<number>();
  const [messagesEventCount, setMessagesEventCount] = useState<number>();
  const [messagesErrorCount, setMessagesErrorCount] = useState<number>();
  // Tokens
  const [tokenTransfersCount, setTokenTransfersCount] = useState<number>();
  const [tokenMintCount, setTokenMintcount] = useState<number>();
  const [tokenBurnCount, setTokenBurnCount] = useState<number>();
  const [tokenErrorCount, setTokenErrorCount] = useState<number>();
  console.log(namespace);
  // Event types histogram
  const [eventTypesData, setEventTypesData] = useState<BarDatum[]>([]);

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
      numErrors: offchainErrorCount,
      data: [
        { header: 'In', data: offchainInCount },
        { header: 'Out', data: offchainOutCount },
      ],
    },
    {
      header: 'Messages',
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
  // useEffect(() => {
  //   const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
  //   const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;

  //   Promise.all([
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.blockchainEvents}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.blockchainEvents}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.events}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.events}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.messages}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.messages}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.tokenTransfers}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.tokenTransfers}${qParams}`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.tokenTransfers}${qParams}`
  //     ),
  //   ])
  //     .then(
  //       ([
  //         blockchainTx,
  //         blockchainEvents,
  //         offChainIn,
  //         offChainOut,
  //         msgsTx,
  //         msgsEvents,
  //         tokensTransfer,
  //         tokensMint,
  //         tokensBurn,
  //       ]: IGenericPagedResponse[]) => {
  //         setBlockchainTxCount(blockchainTx.total);
  //         setBlockchainEventCount(blockchainEvents.total);

  //         setOffchainInCount(offChainIn.total);
  //         setOffchainOutCount(offChainOut.total);

  //         setMessagesEventCount(msgsTx.total);
  //         setMessagesTxCount(msgsEvents.total);

  //         setTokenTransfersCount(tokensTransfer.total);
  //         setTokenMintcount(tokensMint.total);
  //         setTokenBurnCount(tokensBurn.total);
  //       }
  //     )
  //     .catch((err) => {
  //       reportFetchError(err);
  //     });
  // }, [selectedNamespace, createdFilter, lastEvent, filterString]);

  const mediumCards: IMediumCard[] = [
    {
      headerComponent: <ArrowForwardIcon />,
      headerText: 'My Node - [Node Name]',
      component: <Typography>Placeholder</Typography>,
    },
    {
      headerComponent: undefined,
      headerText: 'Network Map',
      component: <NetworkMap></NetworkMap>,
    },
    // {
    //   headerComponent: undefined,
    //   headerText: 'Event Types',
    //   component: eventTypesData.length ? (
    //     <Histogram
    //       colors={[FFColors.Pink, FFColors.Orange, FFColors.Yellow]}
    //       data={eventTypesData}
    //       indexBy="timestamp"
    //       keys={['blockchain', 'transfers', 'messages']}
    //     ></Histogram>
    //   ) : (
    //     <Typography>Test</Typography>
    //   ),
    // },
  ];

  // Medium Card UseEffect
  // useEffect(() => {
  //   const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);
  //   const qParams = `?count=true&limit=1${createdFilterObject.filterString}`;

  //   Promise.all([
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.events}${qParams}&type=blockchain_event`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.events}${qParams}&type=message_confirmed`
  //     ),
  //     fetchCatcher(
  //       `${FF_Paths.namespacePrefix}/default${FF_Paths.events}${qParams}&type=transaction_submitted`
  //     ),
  //   ])
  //     .then(
  //       ([
  //         blockchainEvents,
  //         messageConfirmedEvents,
  //         transferEvents,
  //       ]: IGenericPagedResponse[]) => {
  //         setEventTypesData([
  //           {
  //             timestamp: '2022-02-16T00:51:37Z',
  //             blockchain: blockchainEvents.total,
  //             blockchainColor: FFColors.Yellow,
  //             transfers: transferEvents.total,
  //             transfersColor: FFColors.Orange,
  //             messages: messageConfirmedEvents.total,
  //             messagesColor: FFColors.Pink,
  //           },
  //           {
  //             timestamp: '2022-02-16T01:51:37Z',
  //             blockchain: blockchainEvents.total,
  //             blockchainColor: FFColors.Yellow,
  //             transfers: transferEvents.total,
  //             transfersColor: FFColors.Orange,
  //             messages: messageConfirmedEvents.total,
  //             messagesColor: FFColors.Pink,
  //           },
  //           {
  //             timestamp: '2022-02-16T02:51:37Z',
  //             blockchain: blockchainEvents.total,
  //             blockchainColor: FFColors.Yellow,
  //             transfers: transferEvents.total,
  //             transfersColor: FFColors.Orange,
  //             messages: messageConfirmedEvents.total,
  //             messagesColor: FFColors.Pink,
  //           },
  //           {
  //             timestamp: '2022-02-16T03:51:37Z',
  //             blockchain: blockchainEvents.total,
  //             blockchainColor: FFColors.Yellow,
  //             transfers: transferEvents.total,
  //             transfersColor: FFColors.Orange,
  //             messages: messageConfirmedEvents.total,
  //             messagesColor: FFColors.Pink,
  //           },
  //           {
  //             timestamp: '2022-02-16T04:51:37Z',
  //             blockchain: blockchainEvents.total,
  //             blockchainColor: FFColors.Yellow,
  //             transfers: transferEvents.total,
  //             transfersColor: FFColors.Orange,
  //             messages: messageConfirmedEvents.total,
  //             messagesColor: FFColors.Pink,
  //           },
  //           {
  //             timestamp: '2022-02-16T05:51:37Z',
  //             blockchain: blockchainEvents.total,
  //             blockchainColor: FFColors.Yellow,
  //             transfers: transferEvents.total,
  //             transfersColor: FFColors.Orange,
  //             messages: messageConfirmedEvents.total,
  //             messagesColor: FFColors.Pink,
  //           },
  //         ]);
  //       }
  //     )
  //     .catch((err) => {
  //       reportFetchError(err);
  //     });
  // }, [selectedNamespace, createdFilter, lastEvent, filterString]);

  const tableCards: ITableCard[] = [
    {
      headerComponent: <ArrowForwardIcon />,
      headerText: 'My Recently Submitted Transactions',
      component: (
        <List
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
          }}
        >
          {recentSubmittedTxs.map((tx, idx) => (
            <TableCardItem key={idx} item={tx} />
          ))}
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
          {recentSubmittedTxs.map((tx, idx) => (
            <TableCardItem key={idx} item={tx} />
          ))}
        </List>
      ),
    },
  ];

  return (
    <>
      <Header title={'Dashboard'} subtitle={'Home'}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <NetworkMap></NetworkMap>
        {/* <Grid container item wrap="nowrap" direction="column">
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
          <Button onClick={() => setViewData(!viewData)}>test</Button>
          <Grid
            spacing={DEFAULT_SPACING}
            container
            item
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
        </Grid> */}
      </Grid>
      {viewData && (
        <TransactionSlide
          open={!!viewData}
          onClose={() => {
            setViewData(undefined);
          }}
        />
      )}
    </>
  );
};
