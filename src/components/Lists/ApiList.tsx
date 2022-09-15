import { Launch } from '@mui/icons-material';
import { IconButton, Link } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_Paths, IFireflyApi } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { DownloadButton } from '../Buttons/DownloadButton';
import { InterfaceButton } from '../Buttons/InterfaceButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  api?: IFireflyApi;
}

export const ApiList: React.FC<Props> = ({ api }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (api) {
      setDataList([
        {
          label: t('endpoint'),
          value: (
            <FFListText
              text={`${FF_Paths.nsPrefix}/${selectedNamespace}/apis/${api.name}`}
              color="primary"
            />
          ),
          button: (
            <FFCopyButton
              value={`${FF_Paths.nsPrefix}/${selectedNamespace}/apis/${api.name}`}
            />
          ),
        },
        {
          label: t('id'),
          value: <FFListText text={api.id} color="primary" />,
          button: <FFCopyButton value={api.id} />,
        },
        {
          label: api.interface.id ? t('interfaceID') : '',
          value: <FFListText text={api.interface.id} color="primary" />,
          button: (
            <>
              <InterfaceButton
                interfaceID={api.interface.id}
                ns={selectedNamespace}
              />
              <FFCopyButton value={api.interface.id} />
            </>
          ),
        },
        {
          label: t('openApi'),
          value: <FFListText text={api.urls.openapi} color="primary" />,
          button: (
            <>
              <DownloadButton
                filename={api.name}
                url={api.urls.openapi}
                isBlob={false}
                namespace={selectedNamespace}
              />
              <FFCopyButton value={api.urls.openapi} />
            </>
          ),
        },
        {
          label: t('ui'),
          value: <FFListText text={api.urls.ui} color="primary" />,
          button: (
            <>
              <Link target="_blank" href={api.urls.ui} underline="always">
                <IconButton>
                  <Launch />
                </IconButton>
              </Link>
              <FFCopyButton value={api.urls.ui} />
            </>
          ),
        },
      ]);
    }
  }, [api]);

  return (
    <>
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
