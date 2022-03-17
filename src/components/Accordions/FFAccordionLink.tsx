import LaunchIcon from '@mui/icons-material/Launch';
import { Grid, IconButton, Link } from '@mui/material';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  header: string;
  link: string;
}

export const FFAccordionLink: React.FC<Props> = ({ header, link }) => {
  return (
    <Grid container item direction="row">
      <Grid item pb={1} justifyContent="flex-start">
        <FFAccordionText color="primary" text={header} />
      </Grid>
      <Grid
        item
        container
        pb={1}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item container xs={10} justifyContent="flex-start">
          <FFAccordionText color="secondary" text={link} />
        </Grid>
        <Grid item container xs={2} justifyContent="flex-end">
          <FFCopyButton value={link}></FFCopyButton>
          <Link target="_blank" href={link} underline="always">
            <IconButton>
              <LaunchIcon />
            </IconButton>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
};
