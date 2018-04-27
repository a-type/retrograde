import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Layout from './Layout';
import Columns from './Columns';
import { H1 } from 'components/generic';
import Users from './Users';

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

export default class SessionView extends React.PureComponent {
  render() {
    return (
      <Query query={GET_SESSION} variables={{ id: this.props.sessionId }}>
        {result => {
          if (result.loading) {
            return <div>Loading...</div>;
          }
          if (result.error) {
            return <div>Error: {result.error}</div>;
          }

          const session = result.data.session;

          return (
            <Layout>
              <H1>{session.name}</H1>
              <Columns columns={session.columns} onCreate={result.refetch} />
              <Users users={session.users} onCreate={result.refetch} />
            </Layout>
          );
        }}
      </Query>
    );
  }
}
