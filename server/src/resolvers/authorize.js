const repo = require('../repo');

module.exports = {
  authorizeSession: (sessionId, context) => sessionId === context.sessionId,

  authorizeColumn: (columnId, context) => {
    const column = repo.getColumn(columnId);
    const session = repo.getSession(context.sessionId);
    if (!session.columns.includes(column)) {
      throw new Error('Forbidden');
    }
  },
};
