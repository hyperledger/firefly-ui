import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import { themeOptions } from '../../theme';

interface Props {
  colors: string[];
  data: BarDatum[];
  indexBy: string;
  keys: string[];
}

export const Histogram: React.FC<Props> = ({ colors, data, indexBy, keys }) => {
  return (
    <Box
      mt={2}
      borderRadius={1}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <ResponsiveBar
        data={data}
        colors={colors}
        keys={keys}
        indexBy={indexBy}
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
                    {`${key.toUpperCase()}: ${data[key] ?? 0}`}
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
