import React from 'react';
import { Message } from 'semantic-ui-react';
import { Field } from 'formik';

export class ErrorMessage extends React.Component {
  renderFormField = ({ form: { errors } }) => {
    return errors.message ? (
      <Message negative header="Server Error" content={errors.message} />
    ) : null;
  };

  render() {
    return <Field name="error-message" component={this.renderFormField} />;
  }
}
