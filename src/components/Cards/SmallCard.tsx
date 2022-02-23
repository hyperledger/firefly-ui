import { Chip, Grid, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { ISmallCard } from '../../interfaces';

type Props = {
  card: ISmallCard;
};

export const SmallCard: React.FC<Props> = ({ card }) => {
  const { t } = useTranslation();
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
        {card.numErrors > 0 && (
          <Grid item>
            <Chip
              label={`${card.numErrors} ${t('failed')}`}
              color="error"
              size="small"
              sx={{ fontSize: 10, fontWeight: 'bold' }}
            />
          </Grid>
        )}
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

              {data.data !== undefined ? (
                <Typography
                  sx={{ fontSize: 24, fontWeight: 'bold' }}
                  variant="subtitle1"
                >
                  {data.data}
                </Typography>
              ) : (
                <Skeleton sx={{ width: 40, height: 40 }} />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
