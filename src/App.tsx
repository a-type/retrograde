import { hot } from 'react-hot-loader/root';

import React, { SFC } from 'react';
import { ApolloProvider } from 'react-apollo-hooks';
import apolloClient from './apollo';
import { Grommet } from 'grommet';
import { dark } from 'grommet/themes';
import Routes from '@/Routes';
import { Provider as AuthProvider } from '@/contexts/AuthContext';
import { Provider as SortProvider } from '@/contexts/SortContext';

const App: SFC<{}> = () => (
  <AuthProvider>
    <ApolloProvider client={apolloClient}>
      <SortProvider>
        <Grommet full theme={dark}>
          <Routes />
        </Grommet>
      </SortProvider>
    </ApolloProvider>
  </AuthProvider>
);

export default hot(App);
