import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IMediumCard } from '../../interfaces';

type Props = {
  card: IMediumCard;
  position?: string;
};

export const MediumCard: React.FC<Props> = ({ card, position }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={1}
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
      >
        <Grid
          container
          alignItems={position ?? 'center'}
          justifyContent="center"
          sx={{ height: 350, width: '100%' }}
          item
        >
          {card.component}
        </Grid>
      </Grid>
    </Box>
  );
};
