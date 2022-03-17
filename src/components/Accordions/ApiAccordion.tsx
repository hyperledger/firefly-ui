import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDataWithHeader, IFireflyApi } from '../../interfaces';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionLink } from './FFAccordionLink';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  api: IFireflyApi;
  isOpen?: boolean;
}

export const ApiAccordion: React.FC<Props> = ({ api, isOpen = false }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('location'),
      data: <HashPopover address={api.location?.address ?? ''} shortHash />,
    },
    {
      header: t('messageID'),
      data: <HashPopover address={api.message} shortHash />,
    },
  ];

  return (
    <Accordion
      key={api.id}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FFAccordionHeader
          leftContent={
            <FFAccordionText color="primary" text={api.name} isHeader />
          }
          rightContent={<HashPopover shortHash address={api.id} />}
        />
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container pb={1} item direction="row">
          {accInfo.map((info, idx) => (
            <Grid key={idx} item xs={6} pb={1} justifyContent="flex-start">
              <FFAccordionText
                color="primary"
                text={info.header ?? ''}
                padding
              />
              {info.data}
            </Grid>
          ))}
        </Grid>
        {/* OpenAPI */}
        <FFAccordionLink header={t('openApi')} link={api.urls.openapi} />
        {/* Swagger */}
        <FFAccordionLink header={t('swagger')} link={api.urls.ui} />
      </AccordionDetails>
    </Accordion>
  );
};
