import React, { SFC } from 'react';
import { Form, FormField, Button } from 'grommet';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';

const CreateSession = gql`
  mutation CreateSession($name: String!) {
    createSession(name: $name) {
      id
      name
    }
  }
`;

type CreateSessionResult = {
  createSession: {
    id: string;
    name: string;
  };
};

export interface CreateSessionFormProps {
  onCreate(sessionId: string): any;
  onCancel(): any;
}

const CreateSessionForm: SFC<CreateSessionFormProps> = ({
  onCreate,
  onCancel,
}) => {
  const mutate = useMutation<CreateSessionResult>(CreateSession);

  return (
    <Form
      onSubmit={async ev => {
        ev.preventDefault();
        const result = await mutate({
          variables: { name: ev.value.name },
        });
        onCreate(result.data.createSession.id);
      }}
    >
      <FormField name="name" label="Session Name:" />
      <Button
        onClick={onCancel}
        label="Nevermind"
        margin={{ right: 'medium' }}
      />
      <Button primary type="submit" label="Let's Go!" />
    </Form>
  );
};

export default CreateSessionForm;
