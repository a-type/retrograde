import { withFilter } from 'graphql-subscriptions';

export const typeDefs = `
  type Card {
    id: ID!
    text: String!
  }

  extend type Query {
    card(id: ID!): Card @cardAccess
  }

  extend type Column {
    cards: [Card!]!
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
  Column: {
    cards(parent, args, { repo }) {
      return Promise.all(parent.cards.map(repo.getCard));
    },
  },
  Mutation: {
    createCard(_parent, { columnId, text }, { repo, pubsub }) {
      const card = repo.createCard(columnId, text);
      pubsub.publish('cardCreated', {
        cardCreated: card,
        sessionId: context.sessionId,
      });
      return card;
    },

    updateCard(_parent, { id, text }, { repo, pubsub }) {
      const updated = repo.updateCard(id, { text });
      pubsub.publish('cardUpdated', {
        cardUpdated: updated,
        sessionId: context.sessionId,
      });
      return updated;
    },

    deleteCard(_parent, { id }, { repo, pubsub }) {
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
