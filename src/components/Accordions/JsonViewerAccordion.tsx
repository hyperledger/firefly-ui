import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { FFJsonViewer } from '../Viewers/FFJsonViewer';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  header: string;
  json: object;
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
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FFAccordionHeader
          leftContent={
            <FFAccordionText color="primary" text={header} isHeader />
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container item direction="row" alignItems="flex-end">
          <Grid item pb={1} xs={10} justifyContent="flex-start">
            <FFJsonViewer json={json} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
