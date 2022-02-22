import { styled } from '@mui/material';
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navigation, NAV_WIDTH } from './Navigation/Navigation';
import { NAMESPACES_PATH } from '../interfaces';
import { ApplicationContext } from '../contexts/ApplicationContext';

const Main = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

const ContentDiv = styled('div')({
  paddingLeft: NAV_WIDTH,
});

const RootDiv = styled('div')({
  display: 'flex',
});

export const AppWrapper: React.FC = () => {
  const { pathname } = useLocation();
  const { selectedNamespace } = useContext(ApplicationContext);
  if (pathname === '/') {
    return (
      <Navigate
        to={`/${NAMESPACES_PATH}/${selectedNamespace}/home`}
        replace={true}
      />
    );
  }

  return (
    <RootDiv>
      <Main>
        <Navigation />
        <ContentDiv>
          <Outlet />
        </ContentDiv>
      </Main>
    </RootDiv>
  );
};
