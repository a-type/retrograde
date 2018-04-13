import repo from '../repo';
import { authorizeSession, authorizeColumn } from './authorize';
import pubsub from '../pubsub';
import { withFilter } from 'graphql-subscriptions';

export default {
  Query: {
    columns(_parent, _args, context) {
      if (!context.sessionId) {
        throw new Error('You are not participating in a session');
      }
      return repo.listColumns(context.sessionId);
    },

    column(_parent, { id }, context) {
      authorizeColumn(id, context);
      return repo.getColumn(id);
    },
  },

  Mutation: {
    createColumn(_parent, { name }, context) {
      if (!context.sessionId) {
        throw new Error('You are not participating in a session');
      }
      const column = repo.createColumn(context.sessionId, name);
      pubsub.publish('columnCreated', {
        columnCreated: column,
        sessionId: context.sessionId,
      });
      return column;
    },

    updateColumn(_parent, { id, name }, context) {
      authorizeColumn(id, context);
      const column = repo.updateColumn(id, { name });
      pubsub.publish('columnUpdated', {
        columnUpdated: column,
        sessionId: context.sessionId,
      });
      return column;
    },

    deleteColumn(_parent, { id }, context) {
      authorizeColumn(id, context);
      const column = repo.deleteColumn(id);
      pubsub.publish('columnDeleted', {
        columnDeleted: column,
        sessionId: context.sessionId,
      });
      return column;
    },
  },
  Subscription: {
    columnCreated: {
      subscribe: () =>
        withFilter(
          pubsub.asyncIterator('columnCreated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    columnUpdated: {
      subscribe: () =>
        withFilter(
          pubsub.asyncIterator('columnUpdated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    columnDeleted: {
      subscribe: () =>
        withFilter(
          pubsub.asyncIterator('columnDeleted'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
  },
};
