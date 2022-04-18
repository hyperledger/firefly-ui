import { ArrowForward } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { IFireFlyCard } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { FFArrowButton } from '../Buttons/FFArrowButton';

type Props = {
  card: IFireFlyCard;
};

export const DetailsCard: React.FC<Props> = ({ card }) => {
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
        <Typography sx={{ fontWeight: 'bold' }}>{card.headerText}</Typography>
        {card.clickPath ? (
          <FFArrowButton link={card.clickPath} />
        ) : (
          // Fake icon button
          <IconButton
            sx={{
              color: 'background.paper',
              backgroundColor: 'background.paper',
              '&:disabled': {
                color: 'background.paper',
              },
            }}
            disabled
          >
            <ArrowForward />
          </IconButton>
        )}
      </Grid>
      <Grid
        container
        alignItems={'flex-start'}
        justifyContent="center"
        direction="column"
        sx={{
          overflow: 'auto',
        }}
      >
        {card.component}
      </Grid>
    </Box>
  );
};
