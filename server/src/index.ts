import schema from './schema';
import createContext from './createContext';
import { ApolloServer } from 'apollo-server';

const port = process.env.PORT || 4000;

const server = new ApolloServer({
  schema,
  context: async ({ req, connection }) => {
    if (connection) {
      console.log(`Subscription socket connecting...`, connection);
      if (connection.context && connection.context.Authorization) {
        console.log(`Auth token for subscription identified (Playground).`);
        return await createContext(
          connection.context.Authorization.replace('Bearer ', ''),
        );
      } else if (connection.authToken) {
        console.log(`Auth token for subscription identified (Client).`);
        return await createContext(connection.authToken);
      } else {
        console.log(`No auth token for subscription`);
        return await createContext(null);
      }
    } else {
      const header = req.get('Authorization');
      if (!header) {
        return await createContext(null);
      }

      return await createContext(header.replace('Bearer ', ''));
    }
  },
  formatError: error => {
    console.error(error);
    return error;
  },
});

server.listen(port, () => {
  console.info(`Ready on http://localhost:${port}`);
});
