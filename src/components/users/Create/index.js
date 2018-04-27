import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { storeAuthToken } from 'apollo/auth';
import Form from './Form';
import Modal from './Modal';

const CREATE_USER = gql`
  mutation CreateUser($sessionId: ID!, $name: String!) {
    createUser(name: $name, sessionId: $sessionId) {
      token
    }
  }
`;

export default class UserCreate extends React.PureComponent {
  render() {
    return (
      <Modal>
        <Mutation mutation={CREATE_USER}>
          {createUser => (
            <Form
              onSubmit={async values => {
                const result = await createUser({
                  variables: {
                    ...values,
                    sessionId: this.props.match.params.id,
                  },
                });
                if (result.data.createUser) {
                  storeAuthToken(result.data.createUser.token);
                  this.props.history.push(
                    this.props.history.location.pathname.replace('/join', ''),
                  );
                }
              }}
            />
          )}
        </Mutation>
      </Modal>
    );
  }
}
