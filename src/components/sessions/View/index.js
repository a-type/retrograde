import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Layout from './Layout';
import Columns from './Columns';
import { H1 } from 'components/generic';
import Users from './Users';
import { pathOr } from 'ramda';

const GET_SESSION = gql`
  query GetSession($id: ID!) {
    session(id: $id) {
      id
      name
      columns {
        id
        name
        cards {
          id
          text
        }
      }
      users {
        id
        name
      }
    }
  }
`;

const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
  }
`;

const GET_USERS = gql`
  query Users($id: ID!) {
    session(id: $id) {
      id
      users {
        ...UserFields
      }
    }
  }

  ${USER_FIELDS}
`;

const USER_SUBSCRIPTION = gql`
  subscription OnUserCreated {
    userCreated {
      ...UserFields
    }
  }

  ${USER_FIELDS}
`;

const COLUMN_FIELDS = gql`
  fragment ColumnFields on Column {
    id
    name
  }
`;

const GET_COLUMNS = gql`
  query Columns($id: ID!) {
    session(id: $id) {
      id
      columns {
        ...ColumnFields
      }
    }
  }

  ${COLUMN_FIELDS}
`;

const COLUMN_SUBSCRIPTION = gql`
  subscription OnColumnCreated {
    columnCreated {
      ...ColumnFields
    }
  }

  ${COLUMN_FIELDS}
`;

export default class SessionView extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Query query={GET_SESSION} variables={{ id: this.props.sessionId }}>
          {result => {
            if (result.loading) {
              return <div>Loading...</div>;
            }
            if (result.error) {
              return <div>Error: {result.error}</div>;
            }

            const session = result.data.session;

            return <H1>{session.name}</H1>;
          }}
        </Query>
        <Query query={GET_COLUMNS} variables={{ id: this.props.sessionId }}>
          {({ subscribeToMore, ...result }) => (
            <Columns
              columns={pathOr([], ['data', 'session', 'columns'], result)}
              subscribe={() =>
                subscribeToMore({
                  document: COLUMN_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newColumn = subscriptionData.data.columnCreated;
                    return {
                      ...prev,
                      session: {
                        ...prev.session,
                        columns: prev.session.columns.concat(newColumn),
                      },
                    };
                  },
                })
              }
            />
          )}
        </Query>
        <Query query={GET_USERS} variables={{ id: this.props.sessionId }}>
          {({ subscribeToMore, ...result }) => (
            <Users
              users={pathOr([], ['data', 'session', 'users'], result)}
              subscribe={() =>
                subscribeToMore({
                  document: USER_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newUser = subscriptionData.data.userCreated;
                    return {
                      ...prev,
                      session: {
                        ...prev.session,
                        users: prev.session.users.concat(newUser),
                      },
                    };
                  },
                })
              }
            />
          )}
        </Query>
      </Layout>
    );
  }
}
