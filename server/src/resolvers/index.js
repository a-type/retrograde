const users = require('./users');
const sessions = require('./sessions');

module.exports = {
  Query: {
    ...users.Query,
    ...sessions.Query,
  },
  Mutation: {
    ...users.Mutation,
    ...sessions.Mutation,
  },
};
