import repo from '../repo';
import { authorizeColumn } from './authorize';
import pubsub from '../pubsub';
import { withFilter } from 'graphql-subscriptions';

export default {
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
      pubsub.publish('cardCreated', {
        cardCreated: card,
        sessionId: context.sessionId,
      });
      return card;
    },

    updateCard(_parent, { id, text }, context) {
      const card = repo.getCard(id);
      if (card.user.id !== context.userId) {
        throw new Error('Forbidden');
      }

      const updated = repo.updateCard(id, { text });
      pubsub.publish('cardUpdated', {
        cardUpdated: updated,
        sessionId: context.sessionId,
      });
      return updated;
    },

    deleteCard(_parent, { id }, context) {
      const card = repo.getCard(id);
      if (card.user.id !== context.userId) {
        throw new Error('Forbidden');
      }

      const deleted = repo.deleteCard(id);
      pubsub.publish('cardDeleted', {
        cardDeleted: deleted,
        sessionId: context.sessionId,
      });
      return deleted;
    },
  },
  Subscription: {
    cardCreated: {
      subscribe: () =>
        withFilter(
          pubsub.asyncIterator('cardCreated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    cardUpdated: {
      subscribe: () =>
        withFilter(
          pubsub.asyncIterator('cardUpdated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    cardDeleted: {
      subscribe: () =>
        withFilter(
          pubsub.asyncIterator('cardDeleted'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
  },
};
