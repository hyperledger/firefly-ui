import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IContractListener, IDataWithHeader } from '../../interfaces';
import { getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  listener: IContractListener;
  isOpen?: boolean;
}

export const ListenerAccordion: React.FC<Props> = ({
  listener,
  isOpen = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('listenerID'),
      data: <HashPopover address={listener.id} shortHash />,
    },
    {
      header: t('protocolID'),
      data: <HashPopover address={listener.protocolId} shortHash />,
    },
    {
      header: t('location'),
      data: (
        <HashPopover address={listener.location?.address ?? ''} shortHash />
      ),
    },
    {
      header: t('created'),
      data: (
        <FFAccordionText
          text={getFFTime(listener.created, true)}
          color="primary"
        />
      ),
    },
  ];

  return (
    <Accordion
      key={listener.id}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FFAccordionHeader
          leftContent={
            <FFAccordionText
              color="primary"
              text={listener.event.name}
              isHeader
            />
          }
          rightContent={
            <FFAccordionText
              color="primary"
              text={getFFTime(listener.created)}
              isHeader
            />
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
        <Grid container item direction="row">
          {accInfo.map((info, idx) => (
            <Grid key={idx} item xs={3} pb={1} justifyContent="flex-start">
              <FFAccordionText
                color="primary"
                text={info.header ?? ''}
                padding
              />
              {info.data}
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
