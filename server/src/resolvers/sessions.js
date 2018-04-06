const repo = require('../repo');

module.exports = {
  Query: {
    session(_parent, { id }) {
      return repo.getSession(id);
    },
  },

  Mutation: {
    createSession(_parent, { name }) {
      return repo.createSession(name);
    },
  },
};
