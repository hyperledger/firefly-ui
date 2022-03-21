import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDataWithHeader, ITransaction } from '../../interfaces';
import { FF_TX_CATEGORY_MAP } from '../../interfaces/enums/transactionTypes';
import { getFFTime } from '../../utils';
import { HashPopover } from '../Popovers/HashPopover';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  tx: ITransaction;
  isOpen?: boolean;
}

export const TransactionAccordion: React.FC<Props> = ({
  tx,
  isOpen = false,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(isOpen);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('blockchainIds'),
      data: (
        <>
          {tx.blockchainIds ? (
            tx.blockchainIds.map((id) => (
              <HashPopover key={id} shortHash address={id} />
            ))
          ) : (
            <FFAccordionText text={t('noBlockchainIds')} color="secondary" />
          )}
        </>
      ),
    },
    {
      header: t('created'),
      data: (
        <FFAccordionText text={getFFTime(tx.created, true)} color="primary" />
      ),
    },
  ];

  return (
    <>
      <Accordion
        key={tx.id}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <FFAccordionHeader
            leftContent={
              <FFAccordionText
                color="primary"
                text={t(FF_TX_CATEGORY_MAP[tx.type]?.nicename)}
                isHeader
              />
            }
            rightContent={<HashPopover shortHash address={tx.id} />}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container item direction="row">
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
        </AccordionDetails>
      </Accordion>
    </>
  );
};
