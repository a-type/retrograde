import React, { SFC } from 'react';
import { Button, Select, TextArea, TextInput } from 'grommet';
import { useMutation, useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { pathOr } from 'ramda';
import Field from '@/components/Field';
import { Formik } from 'formik';

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
    <Formik
      onSubmit={async ({ tags, ...values }) => {
        const tagList = tags.split(',').filter(Boolean);
        const result = await mutate({
          variables: { input: { ...values, tags: tagList } },
        });
        onCreate(result.data.createCard.id);
      }}
      initialValues={{
        text: '',
        category: pathOr('', ['session', 'categories', 0], data),
        tags: '',
      }}
    >
      {({ values, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <Field label="Text:">
            <TextArea
              name="text"
              value={values.text}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
          <Field label="Category:">
            <Select
              name="category"
              options={pathOr([], ['session', 'categories'], data)}
              value={values.category}
              onChange={val => setFieldValue('category', val)}
              onBlur={handleBlur}
            />
          </Field>
          <Field label="Tags (comma separated):">
            <TextInput
              name="tags"
              value={values.tags}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
          <Button
            onClick={onCancel}
            label="Nevermind"
            margin={{ right: 'medium' }}
          />
          <Button primary type="submit" label="Add Card" />
        </form>
      )}
    </Formik>
  );
};

export default CreateCardForm;
