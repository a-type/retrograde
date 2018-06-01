import jwt from 'jsonwebtoken';
import { withFilter } from 'graphql-subscriptions';
import pubsub from '../../pubsub';

const SECRET = process.env.JWT_SECRET || 'notsecret';

export const typeDefs = `
  type AuthPayload {
    token: String!
  }

  type User {
    id: ID!
    name: String!
  }

  extend type Query {
    me: User
  }

  extend type Session {
    users: [User!]!
  }

  extend type Card {
    author: User!
  }

  extend type Mutation {
    createUser(sessionId: ID!, name: String!): AuthPayload!
  }

  extend type Subscription {
    userCreated: User
    userUpdated: User
    userDeleted: User
  }
`;

export const resolvers = {
  Query: {
    me(_parent, _args, context) {
      console.log(context);
      return context.user;
    },
  },

  Session: {
    users(parent, args, { repo }) {
      return Promise.all(parent.users.map(repo.getUser));
    },
  },

  Card: {
    author(parent, args, { repo }) {
      return repo.getUser(parent.author);
    },
  },

  Mutation: {
    createUser: async (_parent, { sessionId, name }, { repo }) => {
      const user = await repo.createUser(sessionId, name);
      const token = jwt.sign({ sessionId, userId: user.id }, SECRET);
      console.info(`PubSub => userCreated: ${JSON.stringify(user)}`);
      pubsub.publish('userCreated', { userCreated: user, sessionId });
      return { token };
    },
  },

  Subscription: {
    userCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('userCreated'),
        (payload, _variables, context) => {
          console.info(context);
          console.info(payload);
          return context.sessionId === payload.sessionId;
        },
      ),
    },
    userUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('userUpdated'),
        (payload, _variables, context) =>
          context.sessionId === payload.sessionId,
      ),
    },
    userDeleted: {
      subscribe: () =>
        withFilter(
          () => pubsub.asyncIterator('userDeleted'),
          (payload, _variables, context) =>
            context.sessionId === payload.sessionId,
        ),
    },
  },
};
