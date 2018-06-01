import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { authTokenHeader, rawAuthToken } from './auth';

const cache = new InMemoryCache({});

const request = async operation => {
  const token = authTokenHeader();
  operation.setContext({
    headers: {
      authorization: token,
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    }),
);

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: rawAuthToken(),
    },
  },
});

const netLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
          console.warn(
            `[GraphQL Error] Message: ${message}, Location: ${locations}, Path: ${path}`,
          );
        });
      }
      if (networkError) {
        console.error(`[Network Error] ${networkError}`);
      }
    }),
    requestLink,
    netLink,
  ]),
  cache,
});

export default client;
