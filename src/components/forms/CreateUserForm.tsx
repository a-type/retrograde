import React, { SFC } from 'react';
import { Form, FormField, Button } from 'grommet';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import auth from '@/apollo/auth';

const CreateUser = gql`
  mutation CreateUser($sessionId: ID!, $name: String!) {
    createUser(sessionId: $sessionId, name: $name) {
      token
    }
  }
`;

type CreateUserResult = {
  createUser: {
    token;
  };
};

export interface CreateUserFormProps {
  onCreate(): any;
  onCancel(): any;
  sessionId: string;
}

const CreateUserForm: SFC<CreateUserFormProps> = ({
  sessionId,
  onCreate,
  onCancel,
}) => {
  const mutate = useMutation<CreateUserResult>(CreateUser);

  return (
    <Form
      onSubmit={async ev => {
        ev.preventDefault();
        const result = await mutate({
          variables: { sessionId, name: ev.value.name },
        });
        auth.storeAuthToken(result.data.createUser.token);
        onCreate();
      }}
    >
      <FormField name="name" label="Your Name:" />
      <Button
        onClick={onCancel}
        label="Nevermind"
        margin={{ right: 'medium' }}
      />
      <Button primary type="submit" label="Join" />
    </Form>
  );
};

export default CreateUserForm;
