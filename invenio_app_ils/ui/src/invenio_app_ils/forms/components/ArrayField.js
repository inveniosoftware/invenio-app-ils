import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { Form, Button, Segment } from 'semantic-ui-react';

export class ArrayField extends Component {
  constructor(props) {
    super(props);
    this.fieldPath = props.fieldPath;
    this.label = props.label;
    this.addButtonLabel = props.addButtonLabel;
    this.defaultNewValue = props.defaultNewValue;
    this.required = props.required;
    this.uiProps = props.uiProps;
  }

  renderArrayField = props => {
    const {
      form: { values },
      ...arrayHelpers
    } = props;
    return (
      <Form.Field required={this.required} {...this.uiProps}>
        <label>{this.label}</label>
        {getIn(values, this.fieldPath, []).map((value, index) => {
          const arrayPath = this.fieldPath;
          const indexPath = index;
          return (
            <Form.Group widths="equal" key={`${arrayPath}.${indexPath}`}>
              {this.props.render({ arrayPath, indexPath, ...props })}
            </Form.Group>
          );
        })}
        <Button
          type="button"
          color="teal"
          onClick={() => {
            arrayHelpers.push(this.defaultNewValue);
          }}
        >
          {this.addButtonLabel}
        </Button>
      </Form.Field>
    );
  };

  render() {
    return (
      <FieldArray
        name={this.fieldPath}
        component={this.renderArrayField}
      ></FieldArray>
    );
  }
}

ArrayField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  addButtonLabel: PropTypes.string,
  defaultNewValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  render: PropTypes.func.isRequired,
  required: PropTypes.bool,
  uiProps: PropTypes.object,
};

ArrayField.defaultProps = {
  label: '',
  addButtonLabel: 'Add new row',
  placeholder: '',
  required: false,
  uiProps: {},
};
