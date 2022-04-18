import { Box, Chip, Grid, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ISmallCard } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS } from '../../theme';

type Props = {
  cardData: ISmallCard;
};

export const SmallCard: React.FC<Props> = ({ cardData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Grid
      sm={12}
      md={6}
      lg={3}
      alignItems="center"
      justifyContent="flex-end"
      container
      item
    >
      <Box
        p={2}
        borderRadius={DEFAULT_BORDER_RADIUS}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'background.paper',
          '&:hover': cardData.clickPath && {
            backgroundColor: 'secondary.dark',
            cursor: 'pointer',
          },
        }}
        onClick={() =>
          cardData.clickPath ? navigate(cardData.clickPath) : undefined
        }
      >
        {/* Header */}
        <Grid
          container
          alignItems="flex-end"
          justifyContent="space-between"
          direction="row"
          sx={{ paddingBottom: 1 }}
          item
        >
          <Typography
            sx={{
              fontWeight: 'bold',
            }}
            noWrap
          >
            {cardData.header}
          </Typography>
          {cardData.numErrors && cardData.numErrors > 0 && (
            <Chip
              onClick={(e) => {
                e.stopPropagation();
                cardData.errorLink ? navigate(cardData.errorLink) : undefined;
              }}
              label={`${cardData.numErrors} ${t('failed')}`}
              color="error"
              size="small"
              sx={{
                fontSize: 10,
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            />
          )}
        </Grid>
        {/* Data */}
        <Grid
          container
          alignItems="flex-end"
          justifyContent={
            cardData.data.length > 1 ? 'space-evenly' : 'flex-start'
          }
          direction="row"
          item
        >
          {cardData.data.map((data, idx) => {
            return (
              <Grid key={data.header ?? idx} item>
                <Typography
                  noWrap
                  sx={{ fontSize: 12, textTransform: 'uppercase' }}
                  variant="subtitle2"
                >
                  {data.header}
                </Typography>

                {data.data !== undefined ? (
                  <Typography
                    noWrap
                    sx={{ fontSize: 24, fontWeight: 'bold' }}
                    variant="subtitle1"
                  >
                    {data.data}
                  </Typography>
                ) : (
                  <Skeleton sx={{ width: 40, height: 42 }} />
                )}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};
