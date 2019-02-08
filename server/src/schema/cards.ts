import { withFilter } from 'graphql-subscriptions';
import pubsub from '../pubsub';

export const typeDefs = `
  type Card {
    id: ID!
    text: String!
    tags: [String!]!
  }

  extend type Session {
    cards: [Card!]! @inSession
  }

  extend type Query {
    card(id: ID!): Card @cardAccess
  }

  extend type Mutation {
    createCard(columnId: ID!, text: String): Card! @columnAccess(idArg: "columnId")
    updateCard(id: ID!, text: String!): Card! @cardAccess
    deleteCard(id: ID!): Card! @cardAccess
  }

  extend type Subscription {
    cardCreated: Card
    cardUpdated: Card
    cardDeleted: Card
  }
`;

export const resolvers = {
  Query: {
    card(_parent, { id }, { repo }) {
      return repo.getCard(id);
    },
  },
  Session: {
    cards(parent, _args, { repo, sessionId }) {
      return Promise.all(parent.cardIds.map(repo.getCard));
    },
  },
  Mutation: {
    createCard(_parent, { columnId, text }, { repo, sessionId }) {
      const card = repo.createCard(columnId, text);
      pubsub.publish('cardCreated', {
        cardCreated: card,
        sessionId: sessionId,
      });
      return card;
    },

    updateCard(_parent, { id, text }, { repo, sessionId }) {
      const updated = repo.updateCard(id, { text });
      pubsub.publish('cardUpdated', {
        cardUpdated: updated,
        sessionId: sessionId,
      });
      return updated;
    },

    deleteCard(_parent, { id }, { repo, sessionId }) {
      const deleted = repo.deleteCard(id);
      pubsub.publish('cardDeleted', {
        cardDeleted: deleted,
        sessionId: sessionId,
      });
      return deleted;
    },
  },
  Subscription: {
    cardCreated: {
      subscribe: () =>
        withFilter(
          () => pubsub.asyncIterator('cardCreated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    cardUpdated: {
      subscribe: () =>
        withFilter(
          () => pubsub.asyncIterator('cardUpdated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    cardDeleted: {
      subscribe: () =>
        withFilter(
          () => pubsub.asyncIterator('cardDeleted'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
  },
};
