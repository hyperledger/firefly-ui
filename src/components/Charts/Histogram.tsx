import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import { themeOptions } from '../../theme';
import { CardEmptyState } from '../Cards/CardEmptyState';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';

interface Props {
  colors: string[];
  data: BarDatum[] | undefined;
  emptyText: string;
  includeLegend: boolean;
  indexBy: string;
  isEmpty: boolean;
  keys: string[];
}

export const Histogram: React.FC<Props> = ({
  colors,
  data,
  emptyText,
  includeLegend,
  indexBy,
  isEmpty,
  keys,
}) => {
  return (
    <Box
      borderRadius={1}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      {!data ? (
        <FFCircleLoader height="100%" color="warning"></FFCircleLoader>
      ) : isEmpty ? (
        <CardEmptyState text={emptyText}></CardEmptyState>
      ) : (
        <ResponsiveBar
          data={data}
          colors={colors}
          keys={keys}
          indexBy={indexBy}
          margin={{ top: 10, right: 5, bottom: 60, left: 30 }}
          padding={0.1}
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
          legends={
            includeLegend
              ? [
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 20,
                    translateY: 50,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 10,
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    itemTextColor: 'white',
                    symbolSize: 15,
                    symbolShape: 'circle',
                  },
                ]
              : undefined
          }
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
                color: themeOptions.palette?.text?.primary,
                background: themeOptions.palette?.background?.paper,
              }}
            >
              {dayjs(data.timestamp).format('MM/DD/YYYY h:mm A')}
              <br />
              {keys.map((key, idx) => {
                return (
                  <>
                    <Typography sx={{ color: colors[idx] }}>
                      {`${key.toUpperCase()}: ${data[key] ?? 0}`}
                    </Typography>
                  </>
                );
              })}
            </div>
          )}
        />
      )}
    </Box>
  );
};
