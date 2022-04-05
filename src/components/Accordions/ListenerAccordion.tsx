import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import {
  FF_NAV_PATHS,
  IContractListener,
  IDataWithHeader,
} from '../../interfaces';
import { getFFTime } from '../../utils';
import { LaunchButton } from '../Buttons/LaunchButton';
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
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('listenerID'),
      data: <HashPopover address={listener.id} shortHash />,
    },
    {
      header: t('topic'),
      data: listener.topic ? (
        <HashPopover address={listener.topic} shortHash />
      ) : (
        <FFAccordionText color="secondary" text={t('noTopicInListener')} />
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
            <LaunchButton
              link={FF_NAV_PATHS.blockchainListenersSinglePath(
                selectedNamespace,
                listener.id
              )}
            />
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        {/* Basic Data */}
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
