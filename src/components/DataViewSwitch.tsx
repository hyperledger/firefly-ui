import React, { useContext } from 'react';
import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../contexts/ApplicationContext';

export const DataViewSwitch: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { dataView, setDataView } = useContext(ApplicationContext);

  return (
    <>
      <ButtonGroup size="small">
        <Button
          onClick={() => setDataView('list')}
          className={
            dataView === 'list' ? classes.buttonSelected : classes.button
          }
        >
          {t('list')}
        </Button>
        <Button
          onClick={() => setDataView('timeline')}
          className={
            dataView === 'timeline' ? classes.buttonSelected : classes.button
          }
        >
          {t('timeline')}
        </Button>
      </ButtonGroup>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonSelected: {
    backgroundColor: theme.palette.action.selected,
    borderBottom: '2px solid white',
  },
  button: {
    color: theme.palette.text.disabled,
  },
}));
