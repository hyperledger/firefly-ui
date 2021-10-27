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
import Popover from 'material-ui-popup-state/HoverPopover';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import {
  usePopupState,
  bindHover,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import {
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { NamespaceContext } from '../../contexts/NamespaceContext';
import { ReactComponent as NamespaceIcon } from '../../svg/file-table-box-outline.svg';
import { IRouterParams } from '../../interfaces';
import { useTranslation } from 'react-i18next';

export const NamespacePicker: React.FC = () => {
  const { selectedNamespace, setSelectedNamespace, namespaces } =
    useContext(NamespaceContext);
  const history = useHistory();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { namespace: routerNamespace } = useParams<IRouterParams>();
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'namespace',
  });
  const classes = useStyles();

  const handleNamespaceSelect = (namespace: string) => {
    popupState.close();
    setSelectedNamespace(namespace);
    history.push(
      pathname
        .replace(`/namespace/${routerNamespace}`, `/namespace/${namespace}`)
        .split('/')
        .slice(0, 4) // redirect to the moduleRoutePrefix for the module (/namespace/:namespace/MODULE)
        .join('/')
    );
  };

  return (
    <>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 210,
        }}
        transformOrigin={{
          vertical: 8,
          horizontal: 'left',
        }}
      >
        <List>
          {namespaces.map((namespace, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleNamespaceSelect(namespace.name)}
            >
              <ListItemText
                primary={namespace.name}
                primaryTypographyProps={{
                  className:
                    namespace.name === selectedNamespace
                      ? classes.highlightedText
                      : classes.regularText,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Popover>
      <ListItem>
        <Typography variant="overline">{t('namespace')}</Typography>
      </ListItem>
      <ListItem button {...bindHover(popupState)}>
        <ListItemIcon
          classes={{
            root: classes.closerText,
          }}
        >
          <NamespaceIcon />
        </ListItemIcon>
        <ListItemText
          primary={selectedNamespace}
          primaryTypographyProps={{
            noWrap: true,
            className: classes.navFont,
          }}
        />
        <ChevronRightIcon />
      </ListItem>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  closerText: {
    minWidth: 40,
  },
  navFont: {
    fontSize: '16',
  },
  highlightedText: {
    color: theme.palette.text.primary,
  },
  regularText: {
    color: theme.palette.text.disabled,
  },
}));
