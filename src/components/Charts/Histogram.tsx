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

  const mockTimes = [
    '2022-02-16T00:51:37Z',
    '2022-02-16T01:51:37Z',
    '2022-02-16T02:51:37Z',
    '2022-02-16T03:51:37Z',
    '2022-02-16T04:51:37Z',
    '2022-02-16T05:51:37Z',
    '2022-02-16T06:51:37Z',
    '2022-02-16T07:51:37Z',
    '2022-02-16T08:51:37Z',
    '2022-02-16T09:51:37Z',
    '2022-02-16T10:51:37Z',
    '2022-02-16T11:51:37Z',
    '2022-02-16T12:51:37Z',
    '2022-02-16T13:51:37Z',
    '2022-02-16T14:51:37Z',
    '2022-02-16T15:51:37Z',
    '2022-02-16T16:51:37Z',
    '2022-02-16T17:51:37Z',
    '2022-02-16T18:51:37Z',
    '2022-02-16T19:51:37Z',
    '2022-02-16T20:51:37Z',
    '2022-02-16T21:51:37Z',
    '2022-02-16T22:51:37Z',
    '2022-02-16T23:51:37Z',
  ];
  data = [];
  mockTimes.map((t) => {
    data.push({
      timestamp: t,
      blockchain: Math.floor(Math.random() * 100),
      blockchainColor: FFColors.Yellow,
      tokens: Math.floor(Math.random() * 100),
      tokensColor: FFColors.Orange,
      messages: Math.floor(Math.random() * 100),
      messagesColor: FFColors.Pink,
    });
  });

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
          format: (date) => dayjs(date).format('h:mm'),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: 5,
        }}
        enableLabel={false}
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
