import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { IFireFlyCard } from '../../interfaces';
import { DEFAULT_BORDER_RADIUS } from '../../theme';
import { FFArrowButton } from '../Buttons/FFArrowButton';

type Props = {
  cardData: IFireFlyCard;
  size: 'medium' | 'large';
};

const COMPONENT_HEIGHT = '375px';

export const FireFlyCard: React.FC<Props> = ({ cardData, size }) => {
  return (
    <Grid
      alignItems="center"
      justifyContent="center"
      container
      item
      sm={12}
      md={size === 'medium' ? 12 : 6}
      lg={size === 'medium' ? 4 : 6}
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
          {cardData.clickPath && <FFArrowButton link={cardData.clickPath} />}
        </Grid>
        {/* Component */}
        <Grid
          container
          alignItems={'flex-start'}
          justifyContent="center"
          item
          sx={{ height: COMPONENT_HEIGHT, width: '100%', overflow: 'auto' }}
        >
          {cardData.component}
        </Grid>
      </Box>
    </Grid>
  );
};
