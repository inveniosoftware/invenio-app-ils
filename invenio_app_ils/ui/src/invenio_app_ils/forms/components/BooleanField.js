import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class BooleanField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
    this.required = props.required;
    this.uiProps = props.uiProps;
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

  renderBooleanField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;
    return (
      <Form.Group inline>
        <label>{this.label}</label>
        <Form.Checkbox
          id={this.fieldPath}
          required={this.required}
          name={this.fieldPath}
          onChange={handleChange}
          onBlur={handleBlur}
          checked={getIn(values, this.fieldPath, '')}
          error={this.renderError(errors, this.fieldPath)}
          {...this.uiProps}
        ></Form.Checkbox>
      </Form.Group>
    );
  };
  render() {
    return (
      <Field name={this.fieldPath} component={this.renderBooleanField}></Field>
    );
  }
}

BooleanField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  uiProps: PropTypes.object,
};

BooleanField.defaultProps = {
  label: '',
  required: false,
  uiProps: {},
};
