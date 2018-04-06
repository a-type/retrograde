const jwt = require('jsonwebtoken');
const repo = require('./repo');

const SECRET = process.env.JWT_SECRET || 'notsecret';

module.exports = req => {
  const header = req.get('Authorization');
  if (!header) {
    return {};
  }

  const token = jwt.verify(header.replace('Bearer ', ''), SECRET);

  return {
    user: repo.getUser(token.userId),
    session: repo.getSession(token.sessionId),
  };
};
