import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { useContext, useState } from 'react';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { IData } from '../../interfaces';
import { DownloadButton } from '../Buttons/DownloadButton';
import { DownloadJsonButton } from '../Buttons/DownloadJsonButton';
import { FFJsonViewer } from '../Viewers/FFJsonViewer';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  header: string;
  isOpen?: boolean;
  data: IData;
}

export const DataViewAccordion: React.FC<Props> = ({
  header,
  isOpen = false,
  data,
}) => {
  const [expanded, setExpanded] = useState<boolean>(isOpen);
  const { selectedNamespace } = useContext(ApplicationContext);

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
          rightContent={
            data.blob ? (
              <DownloadButton
                isBlob
                url={data.id}
                namespace={selectedNamespace}
                filename={data.blob.name}
              />
            ) : (
              <DownloadJsonButton
                jsonString={JSON.stringify(data.value)}
                filename={`${data.id}.json`}
              />
            )
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container item direction="row" alignItems="flex-end">
          <Grid item pb={1} xs={10} justifyContent="flex-start">
            <FFJsonViewer json={data.value} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
