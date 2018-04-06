import ApolloClient from 'apollo-boost';
import { authTokenHeader } from './auth';

const client = new ApolloClient({
  uri: '/graphql',
  request: async operation => {
    const token = authTokenHeader();
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },
});

export default client;
