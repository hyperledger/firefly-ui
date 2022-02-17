import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
// import { ISmallCard } from './interfaces';

type Props = {
  leftHeader: string;
  rightHeader: string;
};

export const TimelinePanel: React.FC<Props> = ({ leftHeader, rightHeader }) => {
  return (
    <Box
      mt={2}
      borderRadius={1}
      sx={{
        width: '100%',
        height: 500,
        backgroundColor: 'background.paper',
      }}
    >
      <Grid
        container
        alignItems="flex-start"
        justifyContent="center"
        direction="column"
      >
        <Grid container item>
          <Grid xs={6} container item justifyContent="center">
            <Typography fontSize="12" variant="caption" fontWeight="bold">
              {leftHeader}
            </Typography>
          </Grid>
          <Grid xs={6} container item justifyContent="center">
            <Typography fontSize="12" variant="caption" fontWeight="bold">
              {rightHeader}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
