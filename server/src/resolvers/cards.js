const repo = require('../repo');
const { authorizeColumn } = require('./authorize');
const pubsub = require('../pubsub');

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
      const card = repo.createCard(columnId, text);
      pubsub.publish('cardCreated', { cardCreated: card });
      return card;
    },

    updateCard(_parent, { id, text }, context) {
      const card = repo.getCard(id);
      if (card.user.id !== context.userId) {
        throw new Error('Forbidden');
      }

      const updated = repo.updateCard(id, { text });
      pubsub.publish('cardUpdated', { cardUpdated: updated });
      return updated;
    },

    deleteCard(_parent, { id }, context) {
      const card = repo.getCard(id);
      if (card.user.id !== context.userId) {
        throw new Error('Forbidden');
      }

      const deleted = repo.deleteCard(id);
      pubsub.publish('cardDeleted', { cardDeleted: deleted });
      return deleted;
    },
  },
  Subscription: {
    cardCreated: {
      subscribe: () => pubsub.asyncIterator('cardCreated'),
    },
    cardUpdated: {
      subscribe: () => pubsub.asyncIterator('cardUpdated'),
    },
    cardDeleted: {
      subscribe: () => pubsub.asyncIterator('cardDeleted'),
    },
  },
};
