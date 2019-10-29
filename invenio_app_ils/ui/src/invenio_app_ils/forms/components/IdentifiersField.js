import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ObjectArrayStringField } from '../core';

export class IdentifiersField extends Component {
  render() {
    return (
      <ObjectArrayStringField
        basic={this.props.basic}
        fieldPath={this.props.fieldPath}
        label={this.props.label}
        objectKeysArray={this.props.objectKeysArray}
        defaultNewValue={this.props.defaultNewValue}
        addButtonLabel={this.props.addButtonLabel}
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
