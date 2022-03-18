import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IFFBreadcrumb } from '../../interfaces';

interface Props {
  breadcrumbs: IFFBreadcrumb[];
}

export const FFBreadcrumb: React.FC<Props> = ({ breadcrumbs }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs>
      {breadcrumbs.map((b, idx) => (
        <Link
          key={idx}
          underline={idx !== breadcrumbs.length - 1 ? 'hover' : 'none'}
          color={idx !== breadcrumbs.length - 1 ? 'inherit' : 'text.primary'}
          sx={{
            cursor: idx !== breadcrumbs.length - 1 ? 'pointer' : 'default',
          }}
          onClick={b.link ? () => navigate(b.link ?? '') : undefined}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              fontSize: '14',
            }}
          >
            {b.content}
          </Typography>
        </Link>
      ))}
    </Breadcrumbs>
  );
};
