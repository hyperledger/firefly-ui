import { ArrowForward } from '@mui/icons-material';
import { Grid, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IFireFlyCard } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS } from '../../theme';

type Props = {
  cardData: IFireFlyCard;
};

const COMPONENT_HEIGHT = '375px';

export const MediumCard: React.FC<Props> = ({ cardData }) => {
  return (
    <Grid
      alignItems="center"
      justifyContent="center"
      container
      item
      md={12}
      lg={4}
    >
      <Box
        p={2}
        borderRadius={DEFAULT_BORDER_RADIUS}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Header */}
        <Grid
          container
          item
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          sx={{ paddingBottom: 1 }}
        >
          <Typography sx={{ fontWeight: 'bold' }} noWrap>
            {cardData.headerText}
          </Typography>
          {
            <>
              {cardData.headerComponent ? (
                cardData.headerComponent
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
            </>
          }
        </Grid>
        {/* Component */}
        <Grid
          container
          alignItems={'flex-start'}
          justifyContent="center"
          item
          sx={{ height: COMPONENT_HEIGHT, width: '100%' }}
        >
          {cardData.component}
        </Grid>
      </Box>
    </Grid>
  );
};
