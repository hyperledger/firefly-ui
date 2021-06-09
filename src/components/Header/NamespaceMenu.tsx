// Copyright © 2021 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { useContext } from 'react';
import { TextField, MenuItem, makeStyles } from '@material-ui/core';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { NAMESPACE_LOCALSTORAGE_KEY } from '../../App';

export const NamespaceMenu: React.FC = () => {
  const classes = useStyles();
  const { namespaces, selectedNamespace, setSelectedNamespace } =
    useContext(NamespaceContext);

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
