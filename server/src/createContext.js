const jwt = require('jsonwebtoken');
const repo = require('./repo');

const SECRET = process.env.JWT_SECRET || 'notsecret';

module.exports = rawToken => {
  const token = jwt.verify(rawToken, SECRET);

  return {
    userId: token.userId,
    user: repo.getUser(token.userId),
    sessionId: token.sessionId,
    session: repo.getSession(token.sessionId),
  };
};
