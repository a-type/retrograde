import React from 'react';
import { Formik } from 'formik';
import { Field, Input, Button } from 'components/generic';

export default class ColumnCreateForm extends React.PureComponent {
  render() {
    return (
      <Formik onSubmit={this.props.onSubmit}>
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field.Group>
              <Field label="Create a new column">
                <Input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </Field>
              <Field>
                <Button type="submit">Create</Button>
              </Field>
            </Field.Group>
          </form>
        )}
      </Formik>
    );
  }
}
