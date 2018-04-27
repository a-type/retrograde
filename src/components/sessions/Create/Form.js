import React from 'react';
import { Formik } from 'formik';
import { Button, Input, Field } from 'components/generic';

export default class SessionCreateForm extends React.PureComponent {
  render() {
    return (
      <Formik onSubmit={this.props.onSubmit}>
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field.Group>
              <Field label="name">
                <Input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </Field>
              <Field align="left">
                <Button type="submit">Create</Button>
              </Field>
            </Field.Group>
          </form>
        )}
      </Formik>
    );
  }
}
