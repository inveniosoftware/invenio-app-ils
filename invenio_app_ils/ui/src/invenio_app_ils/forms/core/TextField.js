import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class TextField extends Component {
  renderError(errors, name, direction = 'above') {
    const error = errors[name];
    return error
      ? {
          content: error,
          pointing: direction,
        }
      : null;
  }

  renderFormField = props => {
    const { fieldPath, optimized, ...uiProps } = this.props;
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;
    return (
      <Form.Field>
        <Form.TextArea
          id={fieldPath}
          name={fieldPath}
          onChange={handleChange}
          onBlur={handleBlur}
          value={getIn(values, fieldPath, '')}
          error={this.renderError(errors, fieldPath)}
          {...uiProps}
        ></Form.TextArea>
      </Form.Field>
    );
  };

  render() {
    const FormikField = this.props.optimized ? FastField : Field;
    return (
      <FormikField
        name={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

TextField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  optimized: PropTypes.bool,
};

TextField.defaultProps = {
  optimized: false,
};
