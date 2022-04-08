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
  IBlockchainEvent,
  IDataWithHeader,
} from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { getFFTime } from '../../utils';
import { DownloadJsonButton } from '../Buttons/DownloadJsonButton';
import { LaunchButton } from '../Buttons/LaunchButton';
import { HashPopover } from '../Popovers/HashPopover';
import { FFJsonViewer } from '../Viewers/FFJsonViewer';
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
  const { selectedNamespace } = useContext(ApplicationContext);
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
            <>
              <DownloadJsonButton
                jsonString={JSON.stringify({
                  info: be.info,
                  output: be.output,
                })}
                filename={`${be.id}.json`}
              />
              <LaunchButton
                link={FF_NAV_PATHS.blockchainEventsPath(
                  selectedNamespace,
                  be.id
                )}
                noColor
              />
            </>
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        <Grid container item direction="column" pb={2}>
          <FFJsonViewer
            json={{
              info: be.info,
              output: be.output,
            }}
          />
        </Grid>
        <Grid container item direction="row" pt={DEFAULT_PADDING}>
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
