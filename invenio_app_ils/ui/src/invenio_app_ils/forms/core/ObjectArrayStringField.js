import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { AccordionField, ArrayField, StringField } from '../core';
import _nth from 'lodash/nth';
import { GroupField } from './GroupField';
import { DeleteActionButton } from '../components';

export class ObjectArrayStringField extends Component {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.fieldPath = props.fieldPath;
    /**
     * map = [
     * {key: 'schema', text: 'Schema', required: true}
     * ]
     */
    this.objectKeysArray = props.objectKeysArray;
    this.defaultNewValue = props.defaultNewValue;
    this.addButtonLabel = props.addButtonLabel;
    this.basic = props.basic;
  }

  renderFormField = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    const lastObjectKeyItem = _nth(this.objectKeysArray, -1);
    return (
      <GroupField
        border
        widths="equal"
        title="Identifier"
        action={
          <DeleteActionButton
            size="large"
            onClick={() => arrayHelpers.remove(indexPath)}
          />
        }
      >
        {this.objectKeysArray.slice(0, -1).map(keyObj => (
          <StringField
            key={keyObj.key}
            label={keyObj.text}
            fieldPath={`${objectPath}.${keyObj.key}`}
            inline={true}
            required={keyObj.required || false}
          />
        ))}
        <StringField
          label={lastObjectKeyItem.text}
          fieldPath={`${objectPath}.${lastObjectKeyItem.key}`}
          inline={true}
          required={lastObjectKeyItem.required || false}
          // action={
          //   <Form.Button
          //     color="red"
          //     icon="trash"
          //     onClick={() => {
          //       arrayHelpers.remove(indexPath);
          //     }}
          //   ></Form.Button>
          // }
        />
      </GroupField>
    );
  };

  renderWithourAccordion = () => (
    <ArrayField
      label={this.label}
      fieldPath={this.fieldPath}
      defaultNewValue={this.defaultNewValue}
      renderArrayItem={this.renderFormField}
      addButtonLabel={this.addButtonLabel}
    ></ArrayField>
  );

  render() {
    return this.basic ? (
      this.renderWithourAccordion()
    ) : (
      <AccordionField label={this.label} fieldPath={this.fieldPath}>
        <ArrayField
          fieldPath={this.fieldPath}
          defaultNewValue={this.defaultNewValue}
          renderArrayItem={this.renderFormField}
          addButtonLabel={this.addButtonLabel}
        ></ArrayField>
      </AccordionField>
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
