import React from 'react';
import Form from './Form';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom';

const CREATE_SESSION = gql`
  mutation CreateSession($name: String!) {
    createSession(name: $name) {
      id
      name
    }
  }
`;

class SessionCreate extends React.PureComponent {
  render() {
    return (
      <Mutation mutation={CREATE_SESSION}>
        {createSession => (
          <Form
            onSubmit={async values => {
              const result = await createSession({ variables: values });
              if (result.data.createSession) {
                this.props.history.push(
                  `/sessions/${result.data.createSession.id}`,
                );
              }
            }}
          />
        )}
      </Mutation>
    );
  }
}

export default withRouter(SessionCreate);
