import React from 'react';
import { Formik } from 'formik';
import { Field, Input, Button, H2 } from 'components/generic';

export default class UserCreateForm extends React.PureComponent {
  render() {
    return (
      <Formik onSubmit={this.props.onSubmit}>
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <H2>Join</H2>
            <Field.Group>
              <Field>
                <Input
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
              </Field>
              <Field align="center">
                <Button type="submit">Join</Button>
              </Field>
            </Field.Group>
          </form>
        )}
      </Formik>
    );
  }
}
