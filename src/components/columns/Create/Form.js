import React from 'react';
import { Formik } from 'formik';

export default class ColumnCreateForm extends React.PureComponent {
  render() {
    return (
      <Formik onSubmit={this.props.onSubmit}>
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            <button type="submit">Create</button>
          </form>
        )}
      </Formik>
    );
  }
}
