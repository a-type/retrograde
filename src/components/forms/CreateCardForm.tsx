import React, { SFC } from 'react';
import { Form, FormField, Button, Select } from 'grommet';
import { useMutation, useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { pathOr } from 'ramda';

const CreateCard = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
      id
      text
    }
  }
`;

type CreateCardResult = {
  createCard: {
    id: string;
    text: string;
    category: string;
  };
};

const GetSessionCategories = gql`
  query GetSessionCategories {
    session {
      id
      categories
    }
  }
`;

type GetSessionCategoriesResult = {
  session: {
    id: string;
    categories: string;
  };
};

export interface CreateCardFormProps {
  onCreate(cardId: string): any;
  onCancel(): any;
}

const CreateCardForm: SFC<CreateCardFormProps> = ({ onCreate, onCancel }) => {
  const mutate = useMutation<CreateCardResult>(CreateCard);
  const { data, error } = useQuery<GetSessionCategoriesResult>(
    GetSessionCategories,
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Form
      onSubmit={async ev => {
        ev.preventDefault();
        const tagList = ev.value.tags.split(',').filter(Boolean);
        const result = await mutate({
          variables: { input: { text: ev.value.text, tags: tagList } },
        });
        onCreate(result.data.createCard.id);
      }}
    >
      <FormField name="text" label="Text:" />
      <FormField name="category" label="Category:">
        <Select options={pathOr([], ['session', 'categories'], data)} />
      </FormField>
      <FormField name="tags" label="Tags (comma separated):" />
      <Button
        onClick={onCancel}
        label="Nevermind"
        margin={{ right: 'medium' }}
      />
      <Button primary type="submit" label="Add Card" />
    </Form>
  );
};

export default CreateCardForm;
