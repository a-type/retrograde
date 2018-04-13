import repo from '../repo';
import { authorizeSession, authorizeColumn } from './authorize';
import pubsub from '../pubsub';

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
      pubsub.publish('columnCreated', { columnCreated: column });
      return column;
    },

    updateColumn(_parent, { id, name }, context) {
      authorizeColumn(id, context);
      const column = repo.updateColumn(id, { name });
      pubsub.publish('columnUpdated', { columnUpdated: column });
      return column;
    },

    deleteColumn(_parent, { id }, context) {
      authorizeColumn(id, context);
      const column = repo.deleteColumn(id);
      pubsub.publish('columnDeleted', { columnDeleted: column });
      return column;
    },
  },
  Subscription: {
    columnCreated: {
      subscribe: () => pubsub.asyncIterator('columnCreated'),
    },
    columnUpdated: {
      subscribe: () => pubsub.asyncIterator('columnUpdated'),
    },
    columnDeleted: {
      subscribe: () => pubsub.asyncIterator('columnDeleted'),
    },
  },
};
