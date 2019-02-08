import React, { SFC } from 'react';
import { Router } from '@reach/router';
import LandingPage from '@/components/pages/LandingPage';
import styled from 'styled-components';
import SessionPage from '@/components/pages/SessionPage';

const FullHeightRouter = styled(Router)`
  height: 100%;
`;

const Main: SFC<{}> = () => (
  <FullHeightRouter>
    <SessionPage path="/sessions/:sessionId" />
    <LandingPage path="/" />
  </FullHeightRouter>
);

export default Main;
