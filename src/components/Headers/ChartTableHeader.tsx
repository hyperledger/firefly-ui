import { Grid, Typography } from '@mui/material';

type Props = {
  filter?: JSX.Element;
  title?: string;
};

export const ChartTableHeader: React.FC<Props> = ({ filter, title }) => {
  return (
    <Grid container alignItems="center" direction="row">
      {title && (
        <Grid xs={4} item alignItems="center">
          <Typography fontWeight="bold">{title}</Typography>
        </Grid>
      )}
      <Grid
        xs={title ? 8 : 12}
        item
        container
        justifyContent="flex-end"
        alignItems="center"
      >
        {filter}
      </Grid>
    </Grid>
  );
};
