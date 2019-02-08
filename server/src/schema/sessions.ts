import { Context } from 'createContext';

export const typeDefs = `
  type Session {
    id: ID!
    name: String!
    categories: [String!]!
  }

  extend type Query {
    session: Session!
  }

  extend type Mutation {
    createSession(name: String!): Session!
  }
`;

export const resolvers = {
  Query: {
    session(_parent, _args, { repo, sessionId }: Context) {
      if (!sessionId) {
        return null;
      }
      return repo.getSession(sessionId);
    },
  },

  Mutation: {
    createSession(_parent, { name }, { repo }: Context) {
      return repo.createSession(name);
    },
  },
};
