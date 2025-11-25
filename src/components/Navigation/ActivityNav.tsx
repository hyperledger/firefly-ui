import { InsertChartOutlined } from '@mui/icons-material';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_NAV_PATHS, INavItem } from '../../interfaces';
import { NavSection } from './NavSection';

export const ActivityNav = () => {
  const { t } = useTranslation();
  const { selectedNamespace } = useContext(ApplicationContext);
  const { pathname } = useLocation();

  const timelinePath = FF_NAV_PATHS.activityTimelinePath(selectedNamespace);
  const eventsPath = FF_NAV_PATHS.activityEventsPath(selectedNamespace);
  const txPath = FF_NAV_PATHS.activityTxPath(selectedNamespace);
  const opsPath = FF_NAV_PATHS.activityOpPath(selectedNamespace);

  const navItems: INavItem[] = [
    {
      name: t('timeline'),
      to: timelinePath,
      itemIsActive: pathname === timelinePath,
    },
    {
      name: t('events'),
      to: eventsPath,
      itemIsActive: pathname === eventsPath,
    },
    {
      name: t('transactions'),
      to: txPath,
      itemIsActive: pathname.startsWith(txPath),
    },
    {
      name: t('operations'),
      to: opsPath,
      itemIsActive: pathname === opsPath,
    },
  ];

  return (
    <NavSection
      icon={<InsertChartOutlined />}
      navItems={navItems}
      title={t('activity')}
    />
  );
};
