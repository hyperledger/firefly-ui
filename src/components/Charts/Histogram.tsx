import { Grid, Paper, Popover, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { BarDatum, ResponsiveBar } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { DEFAULT_BORDER_RADIUS, DEFAULT_HIST_HEIGHT } from '../../theme';
import { getFFTime } from '../../utils';
import { EmptyStateCard } from '../Cards/EmptyStateCard';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';

interface Props {
  colors: string[];
  data: BarDatum[] | undefined;
  emptyText: string;
  height?: string | number;
  includeLegend: boolean;
  indexBy: string;
  isEmpty: boolean;
  keys: string[];
  isLoading: boolean;
  filterButton?: JSX.Element;
}

export const getTruncatedColor = (lightMode: boolean) =>
  lightMode ? '#000000' : '#FFFFFF';

export const Histogram: React.FC<Props> = ({
  colors,
  data,
  emptyText,
  height,
  includeLegend,
  indexBy,
  isEmpty,
  keys,
  isLoading,
  filterButton,
}) => {
  const theme = useTheme();
  const [xAxisValues, setXAxisValues] = useState<(string | number)[]>([]);
  const [popoverBucket, setPopoverBucket] = useState<any>(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data) {
      // Show x axis every other tick
      setXAxisValues(data.map((d, i) => (i % 2 === 0 ? '' : d.timestamp)));
    }
  }, [data]);

  const handleMouseLeave = () => {
    setOpen(false);
    setAnchorEl(null);
    setPopoverBucket(undefined);
  };

  const handleMouseEnter = (bucket: any, event: any) => {
    setAnchorEl(event.currentTarget);
    setPopoverBucket(bucket);
    setOpen(true);
  };

  const makePopoverContent = () => {
    return (
      <Paper
        key={popoverBucket.key}
        sx={{
          borderRadius: DEFAULT_BORDER_RADIUS,
          padding: 1,
          backgroundColor: 'background.paper',
        }}
      >
        {Object.entries(popoverBucket.data).map(([key, value], idx) => {
          return (
            key !== 'Truncated' &&
            key !== 'timestamp' && (
              <Typography key={key} sx={{ color: colors[idx] }}>
                {`${key.toUpperCase()}: ${value ?? 0}`}
              </Typography>
            )
          );
        })}
        <Typography variant="subtitle1" color="secondary">
          {getFFTime(popoverBucket.data.timestamp.toString())}
        </Typography>
        <Typography variant="subtitle2" color="secondary">
          {getFFTime(popoverBucket.data.timestamp.toString(), true)}
        </Typography>
      </Paper>
    );
  };

  // Returns key array, altered if buckets have a bar that is truncated
  const getKeys = (data: BarDatum[], keys: string[]) => {
    if (!data.every((d) => d.Truncated === 0) && !keys.includes('Truncated')) {
      keys.push('Truncated');
    }

    return keys;
  };

  // Returns colors array, altered if buckets have a bar that is truncated
  const getColors = (data: BarDatum[], colors: string[]) => {
    const truncatedColor = getTruncatedColor(theme.palette.mode === 'light');
    if (
      !data.every((d) => d.Truncated === 0) &&
      !keys.includes(truncatedColor)
    ) {
      colors.push(truncatedColor);
    }

    return colors;
  };

  return (
    <>
      {filterButton && (
        <Grid
          container
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
        >
          {filterButton}
        </Grid>
      )}
      <Box
        borderRadius={DEFAULT_BORDER_RADIUS}
        sx={{
          width: '100%',
          height: height ?? DEFAULT_HIST_HEIGHT,
          backgroundColor: 'background.paper',
        }}
      >
        {!data || isLoading ? (
          <FFCircleLoader height="100%" color="warning"></FFCircleLoader>
        ) : isEmpty ? (
          <EmptyStateCard height={'80%'} text={emptyText} />
        ) : (
          <>
            <Grid height="98%" width="100%">
              <ResponsiveBar
                data={data}
                colors={getColors(data, colors)}
                keys={getKeys(data, keys)}
                indexBy={indexBy}
                margin={{ top: 10, right: 5, bottom: 60, left: 40 }}
                padding={0.1}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                axisTop={null}
                axisRight={null}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  format: (v) =>
                    xAxisValues?.find((vts) => vts === v)
                      ? dayjs(v).format('h:mm')
                      : '',
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
                          translateX: 0,
                          translateY: 50,
                          itemsSpacing: 2,
                          itemWidth: 115,
                          itemHeight: 10,
                          itemDirection: 'left-to-right',
                          itemOpacity: 1,
                          itemTextColor: theme.palette.text.primary,
                          symbolSize: 15,
                          symbolShape: 'circle',
                        },
                      ]
                    : undefined
                }
                motionConfig="stiff"
                enableLabel={false}
                role="application"
                theme={{
                  background: theme.palette.background.paper,
                  axis: {
                    ticks: {
                      line: {
                        stroke: theme.palette.background.default,
                      },
                      text: {
                        fill: theme.palette.text.disabled,
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: theme.palette.background.default,
                    },
                  },
                }}
                // disable tooltip in favor of popover
                tooltip={() => <></>}
              />
            </Grid>
            {anchorEl && (
              <Popover
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                style={{ pointerEvents: 'none' }}
              >
                {makePopoverContent()}
              </Popover>
            )}
          </>
        )}
      </Box>
    </>
  );
};
