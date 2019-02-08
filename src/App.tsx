import { hot } from 'react-hot-loader/root';

import React, { Component, SFC } from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import apolloClient from './apollo';
import { Grommet } from 'grommet';
import { dark } from 'grommet/themes';
import Routes from '@/Routes';
import { Provider as AuthProvider } from '@/components/auth/Context';

const App: SFC<{}> = () => (
  <AuthProvider>
    <ApolloProvider client={apolloClient}>
      <Grommet full theme={dark}>
        <Routes />
      </Grommet>
    </ApolloProvider>
  </AuthProvider>
);

export default hot(App);
