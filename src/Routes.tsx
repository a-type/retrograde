import React, { SFC } from 'react';
import { Router } from '@reach/router';
import LandingPage from '@/components/pages/LandingPage';
import styled from 'styled-components';
import SessionPage from '@/components/pages/SessionPage';
import SessionJoinPage from '@/components/pages/SessionJoinPage';

const FullHeightRouter = styled(Router)`
  height: 100%;
`;

const Main: SFC<{}> = () => (
  <FullHeightRouter>
    <SessionJoinPage path="/sessions/:sessionId/join" />
    <SessionPage path="/sessions/:sessionId" />
    <LandingPage path="/" />
  </FullHeightRouter>
);

export default Main;
