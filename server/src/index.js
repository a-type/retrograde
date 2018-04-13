const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');
const createContext = require('./createContext');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');

const port = process.env.PORT || 4000;

const app = express();

const createHttpContext = req => {
  const header = req.get('Authorization');
  if (!header) {
    return {};
  }

  return createContext(header.replace('Bearer ', ''));
};

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({ schema, context: createHttpContext(req) })),
);
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`,
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
