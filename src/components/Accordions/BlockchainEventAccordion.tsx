import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBlockchainEvent, IDataWithHeader } from '../../interfaces';
import { getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  be: IBlockchainEvent;
  isOpen?: boolean;
}

export const BlockchainEventAccordion: React.FC<Props> = ({
  be,
  isOpen = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={be.id} shortHash />,
    },
    {
      header: t('source'),
      data: <FFAccordionText text={be.source} color="primary" />,
    },
    {
      header: t('timestamp'),
      data: (
        <FFAccordionText text={getFFTime(be.timestamp, true)} color="primary" />
      ),
    },
  ];

  return (
    <Accordion
      key={be.id}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FFAccordionHeader
          leftContent={
            <FFAccordionText
              color="primary"
              text={be.protocolId ?? be.name}
              isHeader
            />
          }
          rightContent={
            <FFAccordionText color="primary" text={getFFTime(be.timestamp)} />
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        <Grid container item direction="row">
          {accInfo.map((info, idx) => (
            <Grid key={idx} item xs={4} pb={1} justifyContent="flex-start">
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
