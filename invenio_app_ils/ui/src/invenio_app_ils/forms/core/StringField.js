import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class StringField extends Component {
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
    const { fieldPath, inline, optimized, ...uiProps } = this.props;
    const {
      form: { values, handleChange, handleBlur, errors, status },
    } = props;

    return (
      <Form.Field inline={inline}>
        <Form.Input
          fluid
          id={fieldPath}
          name={fieldPath}
          onChange={handleChange}
          onBlur={handleBlur}
          value={getIn(values, fieldPath, '')}
          error={this.renderError(status || errors, fieldPath)}
          {...uiProps}
        />
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

StringField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  optimized: PropTypes.bool,
};

StringField.defaultProps = {
  inline: false,
  optimized: true,
};
