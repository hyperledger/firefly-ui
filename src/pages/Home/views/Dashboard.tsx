import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, Grid, List, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
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
import { TransactionSlide } from '../../../components/Slides/TransactionSlide';
import { Header } from '../../../components/Header';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../../theme';

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
  const [viewData, setViewData] = useState<boolean | undefined>();

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
        <Grid container item wrap="nowrap" direction="column">
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
        </Grid>
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
