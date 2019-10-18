import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class TextField extends Component {
  constructor(props) {
    super(props);

    const { fieldPath, ...uiProps } = props;
    this.fieldPath = fieldPath;
    this.uiProps = uiProps;
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

  renderFormField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;
    return (
      <Form.Field>
        <Form.TextArea
          id={this.fieldPath}
          name={this.fieldPath}
          onChange={handleChange}
          onBlur={handleBlur}
          value={getIn(values, this.fieldPath, '')}
          error={this.renderError(errors, this.fieldPath)}
          {...this.uiProps}
        ></Form.TextArea>
      </Form.Field>
    );
  };

  render() {
    return (
      <Field name={this.fieldPath} component={this.renderFormField}></Field>
    );
  }
}

TextField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
};

TextField.defaultProps = {};
