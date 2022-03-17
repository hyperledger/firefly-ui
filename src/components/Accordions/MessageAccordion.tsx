import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FF_MESSAGES_CATEGORY_MAP,
  IDataWithHeader,
  IMessage,
  MsgStateColorMap,
} from '../../interfaces';
import { getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  isOpen?: boolean;
  message: IMessage;
}

export const MessageAccordion: React.FC<Props> = ({
  message,
  isOpen = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={message.header.id} shortHash />,
    },
    {
      header: t('author'),
      data: <HashPopover address={message.header.author} shortHash />,
    },
    {
      header: t('created'),
      data: (
        <FFAccordionText
          text={getFFTime(message.header.created, true)}
          color="primary"
        />
      ),
    },
  ];

  return (
    <>
      <Accordion
        key={message.header.id}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <FFAccordionHeader
            leftContent={
              <FFAccordionText
                color="primary"
                text={t(FF_MESSAGES_CATEGORY_MAP[message.header.type].nicename)}
                isHeader
              />
            }
            rightContent={
              <Chip
                label={message.state?.toLocaleUpperCase()}
                sx={{ backgroundColor: MsgStateColorMap[message.state] }}
              ></Chip>
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
    </>
  );
};
