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
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';
import { FFCopyButton } from '../Buttons/CopyButton';

interface Props {
  param: IFireFlyParam;
  isOpen?: boolean;
}

export const ListenerEventParamAccordion: React.FC<Props> = ({
  param,
  isOpen = false,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  return (
    <Accordion
      key={param.name}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        backgroundColor: themeOptions.palette?.background?.default,
        width: '100%',
        borderRadius: DEFAULT_BORDER_RADIUS,
        minHeight: '60px',
        '&:before': {
          display: 'none',
        },
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
            <pre>{JSON.stringify(param.schema, null, 2)}</pre>
          </Grid>
          <Grid item pb={1} xs={2} justifyContent="flex-start">
            <FFCopyButton value={JSON.stringify(param.schema)}></FFCopyButton>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
