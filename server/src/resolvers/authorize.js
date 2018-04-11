const repo = require('../repo');

export const authorizeSession = (sessionId, context) =>
  sessionId === context.sessionId;

export const authorizeColumn = (columnId, context) => {
  const column = repo.getColumn(columnId);
  const session = repo.getSession(context.sessionId);
  if (!session.columns.includes(column)) {
    throw new Error('Forbidden');
  }
};
