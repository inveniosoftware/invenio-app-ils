import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FastField, Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class SelectField extends Component {
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
    const {
      form: { values, setFieldValue, handleBlur, errors },
    } = props;
    const {
      defaultValue,
      fieldPath,
      label,
      multiple,
      optimized,
      ...uiProps
    } = this.props;
    return (
      <Form.Dropdown
        fluid
        selection
        searchInput={{ id: fieldPath }}
        label={{ children: label, htmlFor: fieldPath }}
        multiple={multiple}
        name={fieldPath}
        onChange={(event, data) => {
          setFieldValue(fieldPath, data.value);
        }}
        onBlur={handleBlur}
        value={getIn(values, fieldPath, multiple ? [] : defaultValue)}
        error={this.renderError(errors, fieldPath)}
        {...uiProps}
      />
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

SelectField.propTypes = {
  defaultValue: PropTypes.string,
  fieldPath: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  optimized: PropTypes.bool,
};

SelectField.defaultProps = {
  defaultValue: '',
  multiple: false,
  optimized: false,
};
