import React, { Dispatch, SetStateAction } from 'react';
import { DataView } from '../interfaces';

export interface IApplicationContext {
  dataView: DataView;
  setDataView: Dispatch<SetStateAction<DataView>>;
}

export const ApplicationContext = React.createContext<IApplicationContext>({
  dataView: 'list',
  setDataView: () => {
    /* default value */
  },
});
