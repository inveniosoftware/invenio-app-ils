import React, { Component } from 'react';
import { ObjectArrayStringField } from '../../../../../../../../forms';

export class IdentifiersField extends Component {
  render() {
    return (
      <ObjectArrayStringField
        basic={this.props.basic}
        fieldPath={this.props.fieldPath}
        objectKeysArray={[
          { key: 'scheme', text: 'Scheme', required: true },
          { key: 'value', text: 'Identifier value', required: true },
        ]}
        defaultNewValue={{ scheme: '', value: '' }}
        addButtonLabel="Add new identifier"
      />
    );
  }
}
