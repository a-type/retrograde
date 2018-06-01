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
    createColumn(name: String!): Column! @inSession
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
    createColumn(_parent, { name }, { repo }) {
      const column = repo.createColumn(context.sessionId, name);
      pubsub.publish('columnCreated', {
        columnCreated: column,
        sessionId: context.sessionId,
      });
      return column;
    },

    updateColumn(_parent, { id, name }, { repo }) {
      const column = repo.updateColumn(id, { name });
      pubsub.publish('columnUpdated', {
        columnUpdated: column,
        sessionId: context.sessionId,
      });
      return column;
    },

    deleteColumn(_parent, { id }, { repo }) {
      const column = repo.deleteColumn(id);
      pubsub.publish('columnDeleted', {
        columnDeleted: column,
        sessionId: context.sessionId,
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
