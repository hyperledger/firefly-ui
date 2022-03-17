import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { DEFAULT_BORDER_RADIUS, themeOptions } from '../../theme';
import { FFCopyButton } from '../Buttons/CopyButton';

interface Props {
  header: string;
  json: string;
  isOpen?: boolean;
}

export const JsonViewAccordion: React.FC<Props> = ({
  header,
  json,
  isOpen = false,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  return (
    <Accordion
      key={header}
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
          <Typography>{header}</Typography>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container item direction="row" alignItems="flex-end">
          <Grid item pb={1} xs={10} justifyContent="flex-start">
            <pre>{json}</pre>
          </Grid>
          <Grid item xs={2} justifyContent="flex-start">
            <FFCopyButton value={json}></FFCopyButton>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
