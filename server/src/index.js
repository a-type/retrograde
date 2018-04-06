const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');
const createContext = require('./createContext');

const port = process.env.PORT || 4000;

const app = express();

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({ schema, context: createContext(req) })),
);
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(port, () => {
  console.info(`Ready on http://localhost:${port}`);
});
