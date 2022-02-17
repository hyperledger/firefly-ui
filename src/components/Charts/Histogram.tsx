import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import { FFColors, themeOptions } from '../../theme';

interface Props {
  // colors: string[];
  data: any; // BarDatum[] | IMetric[];
  // indexBy: string;
  // keys: string[];
}

export const Histogram: React.FC<Props> = ({ data }) => {
  const keys = ['blockchain', 'tokens', 'messages'];
  const colors = [FFColors.Pink, FFColors.Orange, FFColors.Yellow];
  // TODO: Remove mock data
  data = [
    {
      timestamp: '2022-02-16T20:51:37Z',
      blockchain: 111,
      blockchainColor: FFColors.Yellow,
      tokens: 111,
      tokensColor: FFColors.Orange,
      messages: 70,
      messagesColor: FFColors.Pink,
    },
    {
      timestamp: '2022-02-16T21:51:37Z',
      blockchain: 111,
      blockchainColor: FFColors.Yellow,
      tokens: 111,
      tokensColor: FFColors.Orange,
      messages: 70,
      messagesColor: FFColors.Pink,
    },
    {
      timestamp: '2022-02-16T22:51:37Z',
      blockchain: 111,
      blockchainColor: FFColors.Yellow,
      tokens: 111,
      tokensColor: FFColors.Orange,
      messages: 70,
      messagesColor: FFColors.Pink,
    },
    {
      timestamp: '2022-02-16T23:51:37Z',
      blockchain: 111,
      blockchainColor: FFColors.Yellow,
      tokens: 111,
      tokensColor: FFColors.Orange,
      messages: 70,
      messagesColor: FFColors.Pink,
    },
    {
      timestamp: '2022-02-17T00:51:37Z',
      blockchain: 111,
      blockchainColor: FFColors.Yellow,
      tokens: 111,
      tokensColor: FFColors.Orange,
      messages: 70,
      messagesColor: FFColors.Pink,
    },
    {
      timestamp: '2022-02-17T01:51:37Z',
      blockchain: 111,
      blockchainColor: FFColors.Yellow,
      tokens: 111,
      tokensColor: FFColors.Orange,
      messages: 70,
      messagesColor: FFColors.Pink,
    },
    {
      timestamp: '2022-02-17T02:51:37Z',
      blockchain: 111,
      blockchainColor: FFColors.Yellow,
      tokens: 111,
      tokensColor: FFColors.Orange,
      messages: 70,
      messagesColor: FFColors.Pink,
    },
  ];
  return (
    <Box
      mt={2}
      borderRadius={1}
      sx={{
        width: '100%',
        height: 200,
        backgroundColor: 'background.paper',
      }}
    >
      <ResponsiveBar
        data={data}
        colors={colors}
        keys={keys}
        indexBy="timestamp"
        margin={{ top: 10, right: 30, bottom: 30, left: 40 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: (date) => dayjs(date).format('MM/DD/YYYY h:mm A'),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: 5,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={'background.default'}
        role="application"
        theme={{
          background: 'transparent',
          axis: {
            ticks: {
              line: {
                stroke: themeOptions.palette?.background?.default,
              },
              text: {
                fill: themeOptions.palette?.text?.disabled,
              },
            },
          },
          grid: {
            line: {
              stroke: themeOptions.palette?.background?.default,
            },
          },
        }}
        tooltip={({ data }) => (
          <div
            style={{
              padding: 12,
              color: '#ffffff',
              background: '#1e242a',
            }}
          >
            {dayjs(data.timestamp).format('MM/DD/YYYY h:mm A')}
            <br />
            {keys.map((key) => {
              return (
                <>
                  <Typography sx={{ color: data[`${key}Color`] }}>
                    {`${key.toUpperCase()}: ${data[key]}`}
                  </Typography>
                </>
              );
            })}
          </div>
        )}
      />
    </Box>
  );
};
