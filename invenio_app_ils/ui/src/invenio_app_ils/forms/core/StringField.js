import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, getIn } from 'formik';
import { Form } from 'semantic-ui-react';

export class StringField extends Component {
  constructor(props) {
    super(props);
    const { fieldPath, inline, ...uiProps } = props;
    this.fieldPath = fieldPath;
    this.inline = inline;
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
  handleChange = (event, { value }) => {
    console.log(event);
    console.log(value);
  };
  renderFormField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
    } = props;

    return (
      <Form.Field inline={this.inline}>
        <Form.Input
          fluid
          id={this.fieldPath}
          name={this.fieldPath}
          onChange={this.handleChange}
          onBlur={handleBlur}
          value={getIn(values, this.fieldPath, '')}
          error={this.renderError(errors, this.fieldPath)}
          {...this.uiProps}
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
