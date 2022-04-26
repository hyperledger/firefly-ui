import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { ITokenBalanceWithPool, ITokenPool } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { addDecToAmount, getBalanceTooltip } from '../../utils';
import { FFCopyButton } from '../Buttons/CopyButton';
import { PoolButton } from '../Buttons/PoolButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  balance?: ITokenBalanceWithPool;
  pool?: ITokenPool;
}

export const BalanceList: React.FC<Props> = ({ balance, pool }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
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
          button: <PoolButton ns={selectedNamespace} poolID={pool.id} />,
        },
        {
          label: t('balance'),
          value: (
            <FFListText
              color="primary"
              text={addDecToAmount(
                balance.balance,
                balance.poolObject ? balance.poolObject.decimals : -1
              )}
              tooltip={getBalanceTooltip(
                balance.balance,
                balance.poolObject ? balance.poolObject.decimals : -1
              )}
            />
          ),
        },
        {
          label: balance.uri ? t('uri') : '',
          value: <FFListText color="primary" text={balance.uri ?? ''} />,
          button: <FFCopyButton value={balance.uri ?? ''} />,
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
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
