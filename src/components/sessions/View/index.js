import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

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

          return <div>Session {result.data.session.id}</div>;
        }}
      </Query>
    );
  }
}
