import React, { SFC } from 'react';
import { Router } from '@reach/router';
import LandingPage from '@/components/pages/LandingPage';
import styled from 'styled-components';

const FullHeightRouter = styled(Router)`
  height: 100%;
`;

const Main: SFC<{}> = () => (
  <FullHeightRouter>
    <LandingPage path="/" />
  </FullHeightRouter>
);

export default Main;
