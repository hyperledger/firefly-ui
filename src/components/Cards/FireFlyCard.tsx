import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IFireFlyCard } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS } from '../../theme';

type Props = {
  card: IFireFlyCard;
  height?: string | number;
  position?: string;
};

export const FireFlyCard: React.FC<Props> = ({
  card,
  height = 375,
  position,
}) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={DEFAULT_BORDER_RADIUS}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        sx={{ paddingBottom: 1 }}
      >
        <Grid item>
          <Typography sx={{ fontWeight: 'bold' }}>{card.headerText}</Typography>
        </Grid>
        <Grid item>{card.headerComponent}</Grid>
      </Grid>
      <Grid
        container
        alignItems={position ?? 'center'}
        justifyContent="center"
        direction="column"
        sx={{
          overflow: 'auto',
        }}
      >
        <Grid
          container
          alignItems={position ?? 'center'}
          justifyContent="center"
          sx={{ height: height, width: '100%' }}
          item
        >
          {card.component}
        </Grid>
      </Grid>
    </Box>
  );
};
