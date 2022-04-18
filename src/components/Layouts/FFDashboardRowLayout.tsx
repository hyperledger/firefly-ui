import { Grid } from '@mui/material';
import { DEFAULT_PADDING, DEFAULT_SPACING } from '../../theme';

export const FFDashboardRowLayout: React.FC = ({ children }) => {
  return (
    <Grid
      spacing={DEFAULT_SPACING}
      container
      item
      direction="row"
      pb={DEFAULT_PADDING}
    >
      {children}
    </Grid>
  );
};
