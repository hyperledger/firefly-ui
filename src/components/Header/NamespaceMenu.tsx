import React, { useContext } from 'react';
import { TextField, MenuItem, makeStyles } from '@material-ui/core';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { NAMESPACE_LOCALSTORAGE_KEY } from '../../App';

export const NamespaceMenu: React.FC = () => {
  const classes = useStyles();
  const { namespaces, selectedNamespace, setSelectedNamespace } = useContext(
    NamespaceContext
  );

  const handleSelectNamespace = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedNamespace(event.target.value);
    window.localStorage.setItem(NAMESPACE_LOCALSTORAGE_KEY, event.target.value);
  };

  return (
    <>
      <form noValidate autoComplete="off">
        <TextField
          select
          label="Namespace"
          value={selectedNamespace}
          onChange={handleSelectNamespace}
          InputProps={{
            disableUnderline: true,
          }}
          className={classes.form}
        >
          {namespaces.map((namespace) => (
            <MenuItem key={namespace.name} value={namespace.name}>
              {namespace.name}
            </MenuItem>
          ))}
        </TextField>
      </form>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: '10ch',
  },
}));
