import { Launch } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_NAV_PATHS } from '../../interfaces';
import { FFColors } from '../../theme';

type Props = {
  did?: string;
  nodeID?: string;
};

const getDIDNavURL = (did: string, ns: string) => {
  if (did.startsWith('did:firefly:org')) {
    return FF_NAV_PATHS.networkOrgsPath(ns, did);
  } else if (did.startsWith('did:firefly:node')) {
    return FF_NAV_PATHS.networkNodesPath(ns, did);
  }

  return FF_NAV_PATHS.networkIdentitiesPath(ns, did);
};

export const IdentityButton: React.FC<Props> = ({ did, nodeID }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const navigate = useNavigate();

  return (
    <IconButton
      sx={{ backgroundColor: FFColors.Purple }}
      onClick={(e) => {
        e.stopPropagation();
        did
          ? navigate(getDIDNavURL(did, selectedNamespace))
          : navigate(FF_NAV_PATHS.networkNodesPath(selectedNamespace, nodeID));
      }}
    >
      <Launch />
    </IconButton>
  );
};
