import { makeExecutableSchema } from 'graphql-tools';
import { mergeDeepRight } from 'ramda';
import * as directives from './directives';

import * as cards from './cards';
import * as sessions from './sessions';
import * as users from './users';

const globalTypeDefs = `
  type Query
  type Mutation
  type Subscription

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const resolvers = [cards.resolvers, sessions.resolvers, users.resolvers].reduce(
  mergeDeepRight,
  {},
);

const typeDefs = [
  globalTypeDefs,
  users.typeDefs,
  sessions.typeDefs,
  cards.typeDefs,
];

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: directives,
});
