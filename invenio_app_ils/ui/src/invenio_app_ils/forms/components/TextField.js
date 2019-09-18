import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class TextField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
    this.placeholder = props.placeholder;
    this.required = props.required;
    this.uiProps = props.uiProps;
  }

  renderError(errors, name, direction = 'above') {
    const error = errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  renderTextField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;
    return (
      <Form.Field>
        <Form.TextArea
          required={this.required}
          name={this.fieldPath}
          onChange={handleChange}
          onBlur={handleBlur}
          label={this.label}
          placeholder={this.placeholder}
          value={getIn(values, this.fieldPath, '')}
          error={this.renderError(errors, this.fieldPath)}
          {...this.uiProps}
        ></Form.TextArea>
      </Form.Field>
    );
  };
  render() {
    return (
      <Field name={this.fieldPath} component={this.renderTextField}></Field>
    );
  }
}

TextField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  uiProps: PropTypes.object,
};

TextField.defaultProps = {
  label: '',
  placeholder: '',
  required: false,
  uiProps: {},
};
