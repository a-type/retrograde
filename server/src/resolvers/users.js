const repo = require('../repo');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'notsecret';

module.exports = {
  Query: {
    me(_parent, _args, { context }) {
      return context.user;
    },
  },

  Mutation: {
    createUser(_parent, { sessionId, name }) {
      const user = repo.createUser(sessionId, name);
      const token = jwt.sign({ sessionId, userId: user.id }, SECRET);
      return { token };
    },
  },
};
