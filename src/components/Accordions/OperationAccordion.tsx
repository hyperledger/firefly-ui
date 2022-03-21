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
import { IDataWithHeader, IOperation } from '../../interfaces';
import { FF_OP_CATEGORY_MAP, OpStatusColorMap } from '../../interfaces/enums';
import { getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  op: IOperation;
  isOpen?: boolean;
}

export const OperationAccordion: React.FC<Props> = ({ op, isOpen = false }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('id'),
      data: <HashPopover address={op.id} shortHash />,
    },
    {
      header: t('plugin'),
      data: <FFAccordionText text={op.plugin} color="primary" />,
    },
    {
      header: t('updated'),
      data: (
        <FFAccordionText text={getFFTime(op.updated, true)} color="primary" />
      ),
    },
  ];

  return (
    <Accordion
      key={op.id}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <FFAccordionHeader
          leftContent={
            <FFAccordionText
              color="primary"
              text={t(FF_OP_CATEGORY_MAP[op.type]?.nicename)}
              isHeader
            />
          }
          rightContent={
            <Chip
              label={op.status?.toLocaleUpperCase()}
              sx={{ backgroundColor: OpStatusColorMap[op.status] }}
            ></Chip>
          }
        />
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="row">
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
