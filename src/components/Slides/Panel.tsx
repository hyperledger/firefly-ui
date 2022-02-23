import { Grid, Paper, Typography } from '@mui/material';

export interface IOperationListItem {
  label: string;
  value: JSX.Element;
  badge?: JSX.Element;
  button?: JSX.Element;
  onClick?: () => void;
}

interface Props {
  item: IOperationListItem;
}

export const DrawerPanel: React.FC<Props> = ({ item }) => {
  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        p: 1,
        mb: 1,
      }}
      elevation={0}
    >
      <Grid xs={12} p={1} container>
        <Grid item xs={6} direction="column">
          <Typography
            color="primary"
            sx={{ fontSize: 14, pb: 1, fontWeight: 'bold' }}
          >
            {item.label}
          </Typography>
          {item.value}
        </Grid>
        <Grid
          alignItems="center"
          justifyContent="flex-end"
          container
          item
          xs={4}
          color="primary"
          sx={{ fontSize: 12, fontWeight: 'bold' }}
        >
          {item.badge}
        </Grid>
        <Grid
          container
          item
          xs={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          {item.button}
        </Grid>
      </Grid>
    </Paper>
  );
};
