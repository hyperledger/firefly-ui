import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { IFFBreadcrumb } from '../../interfaces';

interface Props {
  breadcrumbs: IFFBreadcrumb[];
}

export const FFBreadcrumb: React.FC<Props> = ({ breadcrumbs }) => {
  return (
    <Breadcrumbs>
      {breadcrumbs.map((b, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        const link = b.link;
        if (link && !isLast) {
          return (
            <Link
              key={idx}
              component={RouterLink}
              to={link}
              underline="hover"
              color="inherit"
              sx={{ cursor: 'pointer' }}
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
          );
        }

        return (
          <Link
            key={idx}
            underline={!isLast ? 'hover' : 'none'}
            color={!isLast ? 'inherit' : 'text.primary'}
            sx={{
              cursor: 'default',
            }}
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
        );
      })}
    </Breadcrumbs>
  );
};
