import { Chip, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ISmallCard } from './CardInterfaces';

type Props = {
  card: ISmallCard;
};

export const SmallCard: React.FC<Props> = ({ card }) => {
  return (
    <Box
      p={2}
      borderRadius={1}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      <Grid
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
            {card.header}
          </Typography>
        </Grid>
        <Grid item>
          {card.numErrors && (
            <Chip
              label={`${card.numErrors} Failed`}
              color="error"
              size="small"
              sx={{ fontSize: 10, fontWeight: 'bold' }}
            />
          )}
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="flex-end"
        justifyContent="space-evenly"
        direction="row"
      >
        {card.data.map((data) => {
          return (
            <Grid key={data.header} item>
              <Typography
                sx={{ fontSize: 12, textTransform: 'uppercase' }}
                variant="subtitle2"
              >
                {data.header}
              </Typography>
              <Typography
                sx={{ fontSize: 24, fontWeight: 'bold' }}
                variant="subtitle1"
              >
                {data.data}
              </Typography>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
