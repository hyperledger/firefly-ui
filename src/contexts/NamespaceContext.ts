import React, { Dispatch, SetStateAction } from 'react';
import { INamespace } from '../interfaces';

export interface INamespaceContext {
  selectedNamespace: string;
  setSelectedNamespace: Dispatch<SetStateAction<string>>;
  namespaces: INamespace[];
  setNamespaces: Dispatch<SetStateAction<INamespace[]>>;
}

export const NamespaceContext = React.createContext<INamespaceContext>({
  selectedNamespace: '',
  setNamespaces: () => {
    /* default value */
  },
  namespaces: [],
  setSelectedNamespace: () => {
    /* default value */
  },
});
