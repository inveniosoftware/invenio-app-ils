import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class SelectField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
    this.placeholder = props.placeholder;
    this.options = props.options;
    this.uiProps = props.uiProps;
    this.multiple = props.multiple || false;
    this.required = props.required || false;
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

  renderSelectField = props => {
    const {
      form: { values, setFieldValue, handleBlur, errors },
    } = props;
    return (
      <Form.Field>
        <Form.Dropdown
          id={this.fieldPath}
          required={this.required}
          name={this.fieldPath}
          onChange={(event, data) => {
            setFieldValue(this.fieldPath, data.value);
          }}
          onBlur={handleBlur}
          label={this.label}
          placeholder={this.placeholder}
          value={getIn(values, this.fieldPath, this.multiple ? [] : '')}
          error={this.renderError(errors, this.fieldPath)}
          fluid
          selection
          options={this.options}
          multiple={this.multiple}
          {...this.uiProps}
        ></Form.Dropdown>
      </Form.Field>
    );
  };
  render() {
    return (
      <Field name={this.fieldPath} component={this.renderSelectField}></Field>
    );
  }
}

SelectField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  uiProps: PropTypes.object,
};

SelectField.defaultProps = {
  label: '',
  placeholder: '',
  required: false,
  multiple: false,
  uiProps: {},
};
