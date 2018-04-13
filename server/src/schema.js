import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
  type Query {
    me: User!
    session(id: ID!): Session!
    card(id: ID!): Card!
    cards(sessionId: ID!): [Card!]!
    column(id: ID!): Column!
    columns(sessionId: ID!): [Column!]!
  }

  type Mutation {
    createSession(name: String!): Session!
    createUser(sessionId: ID!, name: String!): AuthPayload!

    createCard(columnId: ID!, text: String): Card!
    updateCard(id: ID!, text: String!): Card!
    deleteCard(id: ID!): Card!

    createColumn(name: String!): Column!
    updateColumn(id: ID!, name: String!): Column!
    deleteColumn(id: ID!): Column!
  }

  type Subscription {
    columnCreated: Column
    columnUpdated: Column
    columnDeleted: Column
    cardCreated: Card
    cardUpdated: Card
    cardDeleted: Card
    userCreated: User
    userUpdated: User
    userDeleted: User
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

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
