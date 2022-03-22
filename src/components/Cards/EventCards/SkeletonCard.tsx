import { Grid, Paper, Skeleton } from '@mui/material';
import React from 'react';
import { DEFAULT_BORDER_RADIUS } from '../../../theme';

export const SkeletonCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'background.default',
        borderRadius: DEFAULT_BORDER_RADIUS,
        width: '100%',
      }}
    >
      <Grid
        direction="row"
        container
        sx={{
          borderRadius: DEFAULT_BORDER_RADIUS,
        }}
      >
        <Grid container alignItems="center" direction="row" p={1}>
          <Grid container item alignItems="center" direction="row">
            <Grid
              xs={6}
              container
              item
              direction="row"
              justifyContent="flex-start"
            >
              <Skeleton width="50%" />
            </Grid>
            <Grid
              xs={6}
              container
              item
              direction="row"
              justifyContent="flex-end"
            >
              <Skeleton width="40%" />
            </Grid>
          </Grid>
          <Grid container item alignItems="center" direction="row">
            <Grid
              xs={6}
              container
              item
              direction="row"
              justifyContent="flex-start"
            >
              <Skeleton width="40%" />
            </Grid>
            <Grid
              xs={6}
              container
              item
              direction="row"
              justifyContent="flex-end"
            >
              <Skeleton width="35%" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
