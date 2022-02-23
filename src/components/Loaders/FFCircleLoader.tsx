import { CircularProgress, Grid } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';

type Props = {
  color:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning'
    | 'inherit'
    | undefined;
};

export const FFCircleLoader: React.FC<Props> = ({ color }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      py={DEFAULT_PADDING}
    >
      <CircularProgress color={color} />
    </Grid>
  );
};
