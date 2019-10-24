import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
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
    const { fieldPath, inline, ...uiProps } = this.props;
    const {
      form: { values, handleChange, handleBlur, errors },
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
          error={this.renderError(errors, fieldPath)}
          {...uiProps}
        ></Form.Input>
      </Form.Field>
    );
  };

  render() {
    return (
      <Field name={this.fieldPath} component={this.renderFormField}></Field>
    );
  }
}

StringField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  inline: PropTypes.bool,
};

StringField.defaultProps = {
  inline: false,
};
