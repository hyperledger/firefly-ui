import { ArrowForward } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Props {
  link: string;
}

export const FFArrowButton: React.FC<Props> = ({ link }) => {
  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate(link)}>
      <ArrowForward />
    </IconButton>
  );
};
