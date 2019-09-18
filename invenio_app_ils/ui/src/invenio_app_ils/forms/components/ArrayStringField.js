import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { Form, Button } from 'semantic-ui-react';

export class ArrayStringField extends Component {
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

  renderArrayStringField = props => {
    const {
      form: { values, handleChange, handleBlur, errors },
      ...arrayHelpers
    } = props;

    return (
      <Form.Field required={this.required}>
        <label>{this.label}</label>
        {getIn(values, this.fieldPath, []).map((author, index) => (
          <Form.Field key={`${this.fieldPath}.${index}`}>
            <Form.Input
              key={`${this.fieldPath}.${index}`}
              name={`${this.fieldPath}.${index}`}
              placeholder={this.placeholder}
              value={getIn(values, `${this.fieldPath}.${index}`, '')}
              error={this.renderError(errors, this.fieldPath)}
              action={
                <Button
                  icon="trash"
                  color="red"
                  onClick={() => {
                    arrayHelpers.remove(index);
                  }}
                ></Button>
              }
              onChange={handleChange}
              onBlur={handleBlur}
              fluid
              {...this.uiProps}
            ></Form.Input>
          </Form.Field>
        ))}
        <Form.Button
          type="button"
          icon="plus"
          color="teal"
          onClick={() => {
            arrayHelpers.push('');
          }}
        ></Form.Button>
      </Form.Field>
    );
  };
  render() {
    return (
      <FieldArray
        name={this.fieldPath}
        component={this.renderArrayStringField}
      ></FieldArray>
    );
  }
}

ArrayStringField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  uiProps: PropTypes.object,
};

ArrayStringField.defaultProps = {
  label: '',
  placeholder: '',
  required: false,
  uiProps: {},
};
