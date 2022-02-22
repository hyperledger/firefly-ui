import { Chip, Grid, Typography } from '@mui/material';
import { IChartLegend } from './ChartInterfaces';

type Props = {
  filter: JSX.Element;
  legend: IChartLegend[];
  title: string;
};

export const ChartHeader: React.FC<Props> = ({ filter, legend, title }) => {
  return (
    <Grid
      container
      alignItems="flex-end"
      direction="row"
      sx={{ paddingBottom: 1 }}
    >
      <Grid xs={2} item alignItems="center">
        <Typography fontWeight="bold">{title}</Typography>
      </Grid>
      <Grid
        item
        xs={8}
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        {legend.map((item) => {
          return (
            <>
              <Chip
                sx={{ backgroundColor: item.color }}
                size="small"
                label="&nbsp;&nbsp;"
              ></Chip>
              &nbsp;&nbsp;
              <Typography fontSize={12} variant="subtitle2">
                {' '}
                {item.title}
              </Typography>
              &nbsp;&nbsp;&nbsp;&nbsp;
            </>
          );
        })}
      </Grid>
      <Grid xs={2} item container justifyContent="flex-end" alignItems="center">
        <Typography>{filter}</Typography>
      </Grid>
    </Grid>
  );
};
