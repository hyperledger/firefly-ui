import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FF_NAV_PATHS } from '../../interfaces';
import { FFColors } from '../../theme';

interface Props {
  ns: string;
  interfaceID: string;
  small?: boolean;
}

export const InterfaceButton: React.FC<Props> = ({
  ns,
  interfaceID,
  small = false,
}) => {
  const navigate = useNavigate();
  return (
    <IconButton
      size={small ? 'small' : undefined}
      sx={{ backgroundColor: FFColors.Purple }}
      onClick={(e) => {
        e.stopPropagation();
        navigate(FF_NAV_PATHS.blockchainInterfacesPath(ns, interfaceID));
      }}
    >
      <LaunchIcon />
    </IconButton>
  );
};
