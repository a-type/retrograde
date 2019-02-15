import { withFilter } from 'graphql-subscriptions';
import pubsub from '../pubsub';
import { Context } from 'createContext';

export const typeDefs = `
  type Card {
    id: ID!
    text: String!
    category: String!
    tags: [String!]!
  }

  input CreateCardInput {
    text: String
    category: String!
    tags: [String!]
  }

  extend type Session {
    cards: [Card!]!
  }

  extend type Query {
    card(id: ID!): Card @cardAccess
  }

  extend type Mutation {
    createCard(input: CreateCardInput!): Card!
    updateCard(id: ID!, input: CreateCardInput!): Card! @cardAccess
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
    cards(parent, _args, { repo }: Context) {
      return Promise.all(parent.cardIds.map(repo.getCard));
    },
  },
  Mutation: {
    async createCard(_parent, { input }, { repo, userId, sessionId }: Context) {
      const card = repo.createCard(sessionId, userId, input);
      await pubsub.publish('cardCreated', {
        cardCreated: card,
        sessionId: sessionId,
      });
      return card;
    },

    async updateCard(_parent, { id, input }, { repo, sessionId }: Context) {
      const updated = repo.updateCard(id, input);
      await pubsub.publish('cardUpdated', {
        cardUpdated: updated,
        sessionId: sessionId,
      });
      return updated;
    },

    async deleteCard(_parent, { id }, { repo, sessionId }: Context) {
      const deleted = repo.deleteCard(id);
      await pubsub.publish('cardDeleted', {
        cardDeleted: deleted,
        sessionId: sessionId,
      });
      return deleted;
    },
  },
  Subscription: {
    cardCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('cardCreated'),
        (payload, _variables, context) =>
          context && context.sessionId === payload.sessionId,
      ),
    },
    cardUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('cardUpdated'),
        (payload, _variables, context) =>
          context && context.sessionId === payload.sessionId,
      ),
    },
    cardDeleted: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('cardDeleted'),
        (payload, _variables, context) =>
          context && context.sessionId === payload.sessionId,
      ),
    },
  },
};
