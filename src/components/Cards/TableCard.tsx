import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ITableCard } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';

type Props = {
  card: ITableCard;
};

export const TableCard: React.FC<Props> = ({ card }) => {
  return (
    <Box
      borderRadius={1}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <Grid
        p={DEFAULT_PADDING}
        container
        alignItems="flex-start"
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
