import { Box, Grid, Paper, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IGroupMember } from '../../interfaces';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  DEFAULT_SPACING,
} from '../../theme';
import { FFAccordionText } from '../Accordions/FFAccordionText';
import { IdentityButton } from '../Buttons/IdentityButton';
import { HashPopover } from '../Popovers/HashPopover';

interface Props {
  member: IGroupMember;
  isOpen?: boolean;
}

export const MemberStack: React.FC<Props> = ({ member }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2} pb={DEFAULT_PADDING}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            padding: 2,
            borderRadius: DEFAULT_BORDER_RADIUS,
          }}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={DEFAULT_SPACING}
          >
            {/* Identity */}
            <Grid
              xs={6}
              container
              justifyContent="flex-start"
              direction="column"
              item
            >
              <Grid item>
                <FFAccordionText
                  isHeader
                  color={'primary'}
                  text={t('identity')}
                />
              </Grid>
              <Grid item pt={1}>
                <HashPopover address={member.identity} />
                <IdentityButton did={member.identity} />
              </Grid>
            </Grid>
            {/* Node */}
            <Grid
              xs={6}
              container
              justifyContent="flex-start"
              direction="column"
              item
            >
              <Grid item>
                <FFAccordionText isHeader color={'primary'} text={t('node')} />
              </Grid>
              <Grid item pt={1}>
                <HashPopover address={member.node} />
                <IdentityButton nodeID={member.node} />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
};
