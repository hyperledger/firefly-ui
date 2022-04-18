import { Grid } from '@mui/material';
import { DEFAULT_PADDING } from '../../theme';

interface Props {
  height?: string;
}

export const FFPageLayout: React.FC<Props> = ({ height, children }) => {
  return (
    <Grid
      container
      item
      wrap="nowrap"
      px={DEFAULT_PADDING}
      direction="column"
      height={height ?? undefined}
    >
      {children}
    </Grid>
  );
};
