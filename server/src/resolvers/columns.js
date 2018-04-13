const repo = require('../repo');
const { authorizeSession, authorizeColumn } = require('./authorize');

module.exports = {
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
      return repo.createColumn(context.sessionId, name);
    },

    updateColumn(_parent, { id, name }, context) {
      authorizeColumn(id, context);
      return repo.updateColumn(id, { name });
    },

    deleteColumn(_parent, { id }, context) {
      authorizeColumn(id, context);
      return repo.deleteColumn(id);
    },
  },
};
