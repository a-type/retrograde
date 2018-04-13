const repo = require('../repo');
const { authorizeColumn } = require('./authorize');

module.exports = {
  Query: {
    cards(_parent, { columnId }, context) {
      authorizeColumn(columnId, context);
      return repo.listCards(columnId);
    },
    card(_parent, { id }) {
      authorizeColumn(columnId, context);
      return repo.getCard(id);
    },
  },
  Mutation: {
    createCard(_parent, { columnId, text }, context) {
      authorizeColumn(columnId, context);
      return repo.createCard(columnId, text);
    },

    updateCard(_parent, { id, text }, context) {
      const card = repo.getCard(id);
      if (card.user.id !== context.userId) {
        throw new Error('Forbidden');
      }

      return repo.updateCard(id, { text });
    },

    deleteCard(_parent, { id }, context) {
      const card = repo.getCard(id);
      if (card.user.id !== context.userId) {
        throw new Error('Forbidden');
      }

      return repo.deleteCard(id);
    },
  },
};
