import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { ITokenBalance, ITokenPool } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { FFCircleLoader } from '../Loaders/FFCircleLoader';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  balance?: ITokenBalance;
  pool?: ITokenPool;
}

export const BalanceList: React.FC<Props> = ({ balance, pool }) => {
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (balance && pool) {
      setDataList([
        {
          label: t('pool'),
          value: (
            <Grid
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              container
            >
              <Grid container item justifyContent="flex-start" xs={1}>
                <Jazzicon diameter={20} seed={jsNumberForAddress(pool.id)} />
              </Grid>
              <Grid container item justifyContent="flex-start" xs={11}>
                <FFListText color="primary" text={pool.name} />
              </Grid>
            </Grid>
          ),
        },
        {
          label: t('balance'),
          value: <FFListText color="primary" text={balance.balance} />,
        },
        {
          label: t('uri'),
          value: <FFListText color="primary" text={balance.uri} />,
          button: <FFCopyButton value={balance.uri} />,
        },
        {
          label: t('updated'),
          value: <FFListTimestamp ts={balance.updated} />,
        },
      ]);
    }
  }, [balance, pool]);

  return (
    <>
      {!balance ? (
        <FFCircleLoader color="warning" />
      ) : (
        <>
          {dataList.map((d, idx) => (
            <FFListItem key={idx} item={d} />
          ))}
        </>
      )}
    </>
  );
};
