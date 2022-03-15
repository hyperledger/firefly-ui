import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ITableCard } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS, DEFAULT_PADDING } from '../../theme';

type Props = {
  card: ITableCard;
};

export const TableCard: React.FC<Props> = ({ card }) => {
  return (
    <Box
      borderRadius={DEFAULT_BORDER_RADIUS}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <Grid
        p={DEFAULT_PADDING - 1}
        container
        alignItems="center"
        justifyContent="space-between"
        direction="row"
        sx={{ paddingBottom: 1 }}
      >
        <Grid item>
          <Typography
            sx={{
              fontWeight: 'bold',
            }}
          >
            {card.headerText}
          </Typography>
        </Grid>
        <Grid item>{card.headerComponent}</Grid>
      </Grid>
      <Grid
        container
        alignItems="flex-end"
        justifyContent="space-evenly"
        direction="row"
      >
        {card.component}
      </Grid>
    </Box>
  );
};
