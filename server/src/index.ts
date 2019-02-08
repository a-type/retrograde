import schema from './schema';
import createContext from './createContext';
import { ApolloServer } from 'apollo-server';

const port = process.env.PORT || 4000;

const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      if (connection.authToken) {
        return await createContext(connection.authToken);
      }
    } else {
      const header = req.get('Authorization');
      if (!header) {
        return await createContext(null);
      }

      return await createContext(header.replace('Bearer ', ''));
    }
  },
  subscriptions: {
    onConnect: async (connectionParams, websocket) => {
      // if (connectionParams['authToken']) {
      //   return await createContext(connectionParams['authToken']);
      // } else {
      //   throw new Error('Missing auth token!');
      // }
    },
  },
  formatError: error => {
    console.error(error);
    return error;
  },
});

server.listen(port, () => {
  console.info(`Ready on http://localhost:${port}`);
});
