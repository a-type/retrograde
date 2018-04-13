import users from './users';
import sessions from './sessions';
import cards from './cards';
import columns from './columns';

export default {
  Query: {
    ...users.Query,
    ...sessions.Query,
    ...cards.Query,
    ...columns.Query,
  },
  Mutation: {
    ...users.Mutation,
    ...sessions.Mutation,
    ...cards.Mutation,
    ...columns.Mutation,
  },
  Subscription: {
    ...users.Subscription,
    ...cards.Subscription,
    ...columns.Subscription,
  },
};
