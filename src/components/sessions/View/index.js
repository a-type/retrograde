import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Layout from './Layout';
import Columns from './Columns';

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
              <h1>{session.name}</h1>
              <Columns columns={session.columns} />
              <div>Users</div>
            </Layout>
          );
        }}
      </Query>
    );
  }
}
