import { hot } from 'react-hot-loader/root';

import React, { Component, SFC } from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import apolloClient from './apollo';
import { Grommet } from 'grommet';
import Routes from '@/Routes';

const App: SFC<{}> = () => (
  <ApolloProvider client={apolloClient}>
    <Grommet full>
      <Routes />
    </Grommet>
  </ApolloProvider>
);

export default hot(App);
