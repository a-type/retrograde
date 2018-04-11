const users = require('./users');
const sessions = require('./sessions');
const cards = require('./cards');
const columns = require('./columns');

module.exports = {
  Query: {
    ...users.Query,
    ...sessions.Query,
    ...cards.Query,
    ...columns.Query,
  },
  Mutation: {
    ...users.Mutation,
    ...sessions.Mutation,
    ...cards.Mutation,
    ...columns.Mutation,
  },
};
