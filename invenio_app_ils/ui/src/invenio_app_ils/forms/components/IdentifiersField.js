import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ObjectArrayStringField } from '../core';

export class IdentifiersField extends Component {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.basic = props.basic;
    this.fieldPath = props.fieldPath;
    this.objectKeysArray = props.objectKeysArray;
    this.defaultNewValue = props.defaultNewValue;
    this.addButtonLabel = props.addButtonLabel;
  }

  render() {
    return (
      <ObjectArrayStringField
        basic={this.basic}
        fieldPath={this.fieldPath}
        label={this.label}
        objectKeysArray={this.objectKeysArray}
        defaultNewValue={this.defaultNewValue}
        addButtonLabel={this.addButtonLabel}
      />
    );
  }
}

IdentifiersField.propTypes = {
  addButtonLabel: PropTypes.string,
  basic: PropTypes.bool,
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  objectKeysArray: PropTypes.array,
  defaultNewValue: PropTypes.object,
};

IdentifiersField.defaultProps = {
  addButtonLabel: 'Add new identifier',
  basic: false,
  fieldPath: 'identifiers',
  label: 'Identifiers',
  objectKeysArray: [
    { key: 'scheme', text: 'Scheme', required: true },
    { key: 'value', text: 'Identifier value', required: true },
  ],
  defaultNewValue: { scheme: '', value: '' },
};
