import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Modal,
  Paper,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_NAV_PATHS, IData, IDataWithHeader } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { getFFTime } from '../../utils';
import { DownloadButton } from '../Buttons/DownloadButton';
import { HashPopover } from '../Popovers/HashPopover';
import { FFJsonViewer } from '../Viewers/FFJsonViewer';
import { FFAccordionHeader } from './FFAccordionHeader';
import { FFAccordionText } from './FFAccordionText';

interface Props {
  data: IData;
  isOpen?: boolean;
  showLink?: boolean;
}

export const MessageDataAccordion: React.FC<Props> = ({
  data,
  isOpen = false,
  showLink = true,
}) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<boolean>(isOpen);
  const [openDataModal, setOpenDataModal] = useState(false);

  const accInfo: IDataWithHeader[] = [
    {
      header: t('validator'),
      data: <FFAccordionText text={data.validator} color="primary" />,
    },
    {
      header: t('hash'),
      data: <HashPopover address={data.hash} shortHash />,
    },
    {
      header: t('created'),
      data: (
        <FFAccordionText text={getFFTime(data.created, true)} color="primary" />
      ),
    },
  ];
  console.log(data);
  return (
    <>
      <Accordion
        key={data.id}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <FFAccordionHeader
            leftContent={<HashPopover address={data.id} />}
            rightContent={
              <>
                {data.blob && (
                  <DownloadButton
                    isBlob
                    url={data.id}
                    filename={data.blob.name}
                  />
                )}
                {showLink && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        FF_NAV_PATHS.offchainDataPath(
                          selectedNamespace,
                          data.id
                        )
                      );
                    }}
                  >
                    <LaunchIcon />
                  </IconButton>
                )}
              </>
            }
          />
        </AccordionSummary>
        <AccordionDetails>
          {data.value && (
            <Grid container item direction="column">
              <FFAccordionText
                color="primary"
                text={t('dataValue')}
                padding
                isHeader
              />
              <Grid item>
                <FFJsonViewer json={data.value} />
              </Grid>
            </Grid>
          )}
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
      <Modal
        open={openDataModal}
        onClose={() => setOpenDataModal(false)}
        sx={{ wordWrap: 'break-word' }}
      >
        <Paper sx={modalStyle} elevation={0}>
          <FFJsonViewer json={data.value} />
        </Paper>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: 'absolute' as const,
  overflow: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '50%',
  backgroundColor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  wordWrap: 'break-word',
};
