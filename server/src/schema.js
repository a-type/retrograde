const tools = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    me: User!
    session(id: ID!): Session!
  }

  type Mutation {
    createSession(name: String!): Session!
    createUser(sessionId: ID!, name: String!): AuthPayload!
  }

  type AuthPayload {
    token: String!
  }

  type User {
    id: ID!
    name: String!
  }

  type Card {
    id: ID!
    text: String!
    author: User!
  }

  type Column {
    id: ID!
    name: String!
    cards: [Card!]!
  }

  type Session {
    id: ID!
    name: String!
    users: [User!]!
    columns: [Column!]!
  }
`;

module.exports = tools.makeExecutableSchema({
  typeDefs,
  resolvers,
});
