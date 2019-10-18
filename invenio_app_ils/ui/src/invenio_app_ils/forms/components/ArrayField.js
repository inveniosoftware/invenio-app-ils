import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getIn, FieldArray } from 'formik';
import { Form, Button } from 'semantic-ui-react';

export class ArrayField extends Component {
  constructor(props) {
    super(props);

    const {
      fieldPath,
      addButtonLabel,
      defaultNewValue,
      label,
      renderArrayItem,
      ...uiProps
    } = props;
    this.fieldPath = fieldPath;
    this.label = label;
    this.addButtonLabel = addButtonLabel;
    this.defaultNewValue = defaultNewValue;
    this.renderArrayItem = renderArrayItem;
    this.uiProps = uiProps;
  }

  renderFormField = props => {
    const {
      form: { values },
      ...arrayHelpers
    } = props;
    return (
      <Form.Field {...this.uiProps}>
        <label>{this.label}</label>
        {getIn(values, this.fieldPath, []).map((value, index) => {
          const arrayPath = this.fieldPath;
          const indexPath = index;
          return (
            <Form.Group widths="equal" key={`${arrayPath}.${indexPath}`}>
              {this.renderArrayItem({ arrayPath, indexPath, ...props })}
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
        component={this.renderFormField}
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
  renderArrayItem: PropTypes.func.isRequired,
};

ArrayField.defaultProps = {
  label: '',
  addButtonLabel: 'Add new row',
  placeholder: '',
};
