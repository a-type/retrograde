const repo = require('../repo');
import { authorizeSession, authorizeColumn } from './authorize';

module.exports = {
  Query: {
    columns(_parent, { sessionId }, { context }) {
      authorizeSession(sessionId, context);
      return repo.listColumns(sessionId);
    },

    column(_parent, { id }, context) {
      authorizeColumn(id, context);
      return repo.getColumn(id);
    },
  },

  Mutation: {
    createColumn(_parent, { sessionId, name }, { context }) {
      authorizeSession(sessionId, context);
      return repo.createColumn(sessionId, name);
    },

    updateColumn(_parent, { id, name }, { context }) {
      authorizeColumn(id, context);
      return repo.updateColumn(id, { name });
    },

    deleteColumn(_parent, { id }, { context }) {
      authorizeColumn(id, context);
      return repo.deleteColumn(id);
    },
  },
};
