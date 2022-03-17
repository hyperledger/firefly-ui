import { useTranslation } from 'react-i18next';
import { IContractInterface } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';

interface Props {
  cInterface?: IContractInterface;
}

export const InterfaceList: React.FC<Props> = ({ cInterface }) => {
  const { t } = useTranslation();

  const dataList: IDataListItem[] = [
    {
      label: t('id'),
      value: cInterface?.id,
      button: <FFCopyButton value={cInterface?.id ?? ''} />,
    },
    {
      label: t('messageID'),
      value: cInterface?.message,
      button: <FFCopyButton value={cInterface?.id ?? ''} />,
    },
    {
      label: t('version'),
      value: cInterface?.version,
    },
    {
      label: t('description'),
      value: cInterface?.description.length
        ? cInterface.description
        : t('noDescriptionForInterface').toString(),
    },
  ];

  return (
    <>
      {!cInterface ? (
        <FFCircleLoader color="warning" />
      ) : (
        <>
          {dataList.map((d) => (
            <FFListItem key={d.label} item={d} />
          ))}
        </>
      )}
    </>
  );
};
