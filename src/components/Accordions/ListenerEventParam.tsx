import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { IFireFlyParam } from '../../interfaces';
import { themeOptions } from '../../theme';
import { FFCopyButton } from '../Buttons/CopyButton';

interface Props {
  param: IFireFlyParam;
}

export const ListenerEventParamAccordion: React.FC<Props> = ({ param }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Accordion
      key={param.name}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        backgroundColor: themeOptions.palette?.background?.default,
        width: '100%',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {/* Name */}
        <Grid item container justifyContent="flex-start">
          <Typography>{param.name}</Typography>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container pb={1} item direction="row" alignItems="flex-end">
          <Grid item pb={1} xs={10} justifyContent="flex-start">
            <Typography sx={{ fontSize: '12px' }}>
              <pre>{JSON.stringify(param.schema, null, 2)}</pre>
            </Typography>
          </Grid>
          <Grid item pb={1} xs={2} justifyContent="flex-start">
            <FFCopyButton value={JSON.stringify(param.schema)}></FFCopyButton>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
