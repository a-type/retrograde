import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress } from 'apollo-server-express';
import playground from 'graphql-playground-middleware-express';
import schema from './schema';
import createContext from './createContext';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

const port = process.env.PORT || 4000;

const app = express();

const createHttpContext = async req => {
  const header = req.get('Authorization');
  if (!header) {
    return await createContext(null);
  }

  return await createContext(header.replace('Bearer ', ''));
};

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(async req => {
    const context = await createHttpContext(req);
    return {
      schema,
      context,
    };
  }),
);
app.use(
  '/playground',
  playground({
    endpoint: '/graphql',
    subscriptionEndpoint: `ws://localhost:${port}/subscriptions`,
  }),
);

const server = createServer(app);

server.listen(port, () => {
  console.info(`Ready on http://localhost:${port}`);
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: (connectionParams, websocket) => {
        if (connectionParams.authToken) {
          return createContext(connectionParams.authToken);
        }
      },
    },
    {
      server,
      path: '/subscriptions',
    },
  );
});
