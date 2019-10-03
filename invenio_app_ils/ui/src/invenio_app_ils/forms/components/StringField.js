import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class StringField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
    this.placeholder = props.placeholder;
    this.required = props.required;
    this.inline = props.inline;
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

  renderStringField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;

    return (
      <Form.Field inline={this.inline}>
        <Form.Input
          required={this.required}
          name={this.fieldPath}
          onChange={handleChange}
          onBlur={handleBlur}
          label={this.label}
          placeholder={this.placeholder}
          value={getIn(values, this.fieldPath, '')}
          error={this.renderError(errors, this.fieldPath)}
          fluid
          {...this.uiProps}
        ></Form.Input>
      </Form.Field>
    );
  };
  render() {
    return (
      <Field name={this.fieldPath} component={this.renderStringField}></Field>
    );
  }
}

StringField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  required: PropTypes.bool,
  uiProps: PropTypes.object,
};

StringField.defaultProps = {
  label: '',
  placeholder: '',
  required: false,
  inline: false,
  uiProps: {},
};
