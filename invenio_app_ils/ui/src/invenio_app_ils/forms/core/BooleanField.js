import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class BooleanField extends Component {
  constructor(props) {
    super(props);

    const { fieldPath, label, ...uiProps } = props;
    this.fieldPath = fieldPath;
    this.label = label;
    this.uiProps = uiProps;
  }

  renderError(errors, name, direction = 'left') {
    const error = errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  renderFormField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;
    return (
      <Form.Group inline>
        <label htmlFor={this.fieldPath}>{this.label}</label>
        <Form.Checkbox
          id={this.fieldPath}
          name={this.fieldPath}
          onChange={handleChange}
          onBlur={handleBlur}
          checked={getIn(values, this.fieldPath, '') || false}
          error={this.renderError(errors, this.fieldPath)}
          {...this.uiProps}
        ></Form.Checkbox>
      </Form.Group>
    );
  };
  render() {
    return (
      <Field name={this.fieldPath} component={this.renderFormField}></Field>
    );
  }
}

BooleanField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
};

BooleanField.defaultProps = {
  label: '',
};
