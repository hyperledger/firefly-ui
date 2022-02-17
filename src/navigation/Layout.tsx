import { styled } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation, NAV_WIDTH } from './Navigation';

export const Layout: React.FC = () => {
  const RootDiv = styled('div')({
    display: 'flex',
  });

  const Main = styled('main')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
  });

  const ContentDiv = styled('div')({
    paddingLeft: NAV_WIDTH,
  });

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
