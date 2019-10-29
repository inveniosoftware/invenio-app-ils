import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AccordionField, ArrayField, StringField } from '../core';
import { GroupField } from './GroupField';
import { DeleteActionButton } from '../components';

export class ObjectArrayStringField extends Component {
  renderFormField = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <GroupField
        border
        widths="equal"
        action={
          <DeleteActionButton
            size="large"
            onClick={() => arrayHelpers.remove(indexPath)}
          />
        }
      >
        {this.props.objectKeysArray.map(keyObj => (
          <StringField
            inline
            key={keyObj.key}
            label={keyObj.text}
            fieldPath={`${objectPath}.${keyObj.key}`}
            required={keyObj.required || false}
          />
        ))}
      </GroupField>
    );
  };

  renderWithoutAccordion = () => (
    <ArrayField
      label={this.props.label}
      fieldPath={this.props.fieldPath}
      defaultNewValue={this.props.defaultNewValue}
      renderArrayItem={this.renderFormField}
      addButtonLabel={this.props.addButtonLabel}
    />
  );

  render() {
    return this.props.basic ? (
      this.renderWithoutAccordion()
    ) : (
      <AccordionField
        label={this.props.label}
        fieldPath={this.props.fieldPath}
        content={
          <ArrayField
            fieldPath={this.props.fieldPath}
            defaultNewValue={this.props.defaultNewValue}
            renderArrayItem={this.renderFormField}
            addButtonLabel={this.props.addButtonLabel}
          />
        }
      />
    );
  }
}

ObjectArrayStringField.propTypes = {
  label: PropTypes.string,
  fieldPath: PropTypes.string,
  defaultNewValue: PropTypes.object,
  objectKeysArray: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      text: PropTypes.string,
      required: PropTypes.bool,
    })
  ),
  addButtonLabel: PropTypes.string,
  basic: PropTypes.bool,
};

ObjectArrayStringField.defaultProps = {
  basic: false,
};
