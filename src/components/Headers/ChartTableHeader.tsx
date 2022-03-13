import { Grid, Typography } from '@mui/material';

type Props = {
  filter?: JSX.Element;
  title: string;
};

export const ChartTableHeader: React.FC<Props> = ({ filter, title }) => {
  return (
    <Grid
      container
      alignItems="flex-end"
      direction="row"
      sx={{ paddingBottom: 1 }}
    >
      <Grid xs={6} item alignItems="center">
        <Typography fontWeight="bold">{title}</Typography>
      </Grid>
      <Grid xs={6} item container justifyContent="flex-end" alignItems="center">
        {filter}
      </Grid>
    </Grid>
  );
};
