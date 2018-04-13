import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Form from './Form';

const CREATE_COLUMN = gql`
  mutation CreateColumn($name: String!) {
    createColumn(name: $name) {
      id
      name
    }
  }
`;

export default class ColumnCreate extends React.PureComponent {
  render() {
    return (
      <Mutation mutation={CREATE_COLUMN}>
        {createColumn => (
          <Form onSubmit={values => createColumn({ variables: values })} />
        )}
      </Mutation>
    );
  }
}
