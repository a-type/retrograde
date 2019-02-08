export const typeDefs = `
  type Session {
    id: ID!
    name: String!
  }

  extend type Query {
    session(id: ID!): Session!
  }

  extend type Mutation {
    createSession(name: String!): Session!
  }
`;

export const resolvers = {
  Query: {
    session(_parent, { id }, { repo }) {
      return repo.getSession(id);
    },
  },

  Mutation: {
    createSession(_parent, { name }, { repo }) {
      return repo.createSession(name);
    },
  },
};
