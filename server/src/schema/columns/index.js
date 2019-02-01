import { withFilter } from 'graphql-subscriptions';
import pubsub from '../../pubsub';

export const typeDefs = `
  type Column {
    id: ID!
    name: String!
  }

  extend type Query {
    column(id: ID!): Column! @columnAccess
  }

  extend type Session {
    columns: [Column!]!
  }

  extend type Mutation {
    createColumn(name: String!): Column!
    updateColumn(id: ID!, name: String!): Column! @columnAccess
    deleteColumn(id: ID!): Column! @columnAccess
  }

  extend type Subscription {
    columnCreated: Column
    columnUpdated: Column
    columnDeleted: Column
  }
`;

export const resolvers = {
  Query: {
    column(_parent, { id }, { repo }) {
      return repo.getColumn(id);
    },
  },

  Session: {
    columns(parent, _args, { repo }) {
      return Promise.all(parent.columns.map(repo.getColumn));
    },
  },

  Mutation: {
    createColumn(_parent, { name }, { repo, sessionId }) {
      if (!sessionId) {
        throw new Error("You're not in a session");
      }
      const column = repo.createColumn(sessionId, name);
      pubsub.publish('columnCreated', {
        columnCreated: column,
        sessionId,
      });
      return column;
    },

    updateColumn(_parent, { id, name }, { repo, sessionId }) {
      const column = repo.updateColumn(id, { name });
      pubsub.publish('columnUpdated', {
        columnUpdated: column,
        sessionId,
      });
      return column;
    },

    deleteColumn(_parent, { id }, { repo, sessionId }) {
      const column = repo.deleteColumn(id);
      pubsub.publish('columnDeleted', {
        columnDeleted: column,
        sessionId,
      });
      return column;
    },
  },
  Subscription: {
    columnCreated: {
      subscribe: () =>
        withFilter(
          () => pubsub.asyncIterator('columnCreated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    columnUpdated: {
      subscribe: () =>
        withFilter(
          () => pubsub.asyncIterator('columnUpdated'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
    columnDeleted: {
      subscribe: () =>
        withFilter(
          () => pubsub.asyncIterator('columnDeleted'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
  },
};
