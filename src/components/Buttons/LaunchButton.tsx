import { Launch } from '@mui/icons-material';
import { IconButton, Link } from '@mui/material';

interface Props {
  link: string;
}

export const LaunchButton: React.FC<Props> = ({ link }) => {
  return (
    <Link href={`/ui${link}`} underline="always">
      <IconButton>
        <Launch />
      </IconButton>
    </Link>
  );
};
