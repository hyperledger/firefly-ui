import { useEffect, useState } from 'react';
import { IVerifier } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  verifiers?: IVerifier[];
}

export const VerifiersList: React.FC<Props> = ({ verifiers }) => {
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (verifiers) {
      setDataList(
        verifiers.map(({ type, value }) => {
          return {
            label: type,
            value: <FFListText color="primary" text={value} />,
            button: <FFCopyButton value={value} />,
          };
        })
      );
    }
  }, [verifiers]);

  return (
    <>
      {dataList.map((d, idx) => (
        <FFListItem key={idx} item={d} />
      ))}
    </>
  );
};
