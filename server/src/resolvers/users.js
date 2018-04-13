import repo from '../repo';
import jwt from 'jsonwebtoken';
import pubsub from '../pubsub';
import { withFilter } from 'graphql-subscriptions';

const SECRET = process.env.JWT_SECRET || 'notsecret';

export default {
  Query: {
    me(_parent, _args, context) {
      return context.user;
    },
  },

  Mutation: {
    createUser(_parent, { sessionId, name }) {
      const user = repo.createUser(sessionId, name);
      const token = jwt.sign({ sessionId, userId: user.id }, SECRET);
      pubsub.publish('userCreated', { userCreated: user, sessionId });
      return { token };
    },
  },

  Subscription: {
    userCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('userCreated'),
        (payload, _variables, context) =>
          context.sessionId === payload.sessionId,
      ),
    },
    userUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('userUpdated'),
        (payload, _variables, context) =>
          context.sessionId === payload.sessionId,
      ),
    },
    userDeleted: {
      subscribe: () =>
        withFilter(
          pubsub.asyncIterator('userDeleted'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
  },
};
