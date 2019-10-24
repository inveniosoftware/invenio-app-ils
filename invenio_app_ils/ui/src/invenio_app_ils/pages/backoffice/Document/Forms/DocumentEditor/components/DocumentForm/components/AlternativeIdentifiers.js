import React, { Component } from 'react';
import { ObjectArrayStringField } from '../../../../../../../../forms';

export class AlternativeIdentifiers extends Component {
  render() {
    return (
      <ObjectArrayStringField
        fieldPath="alternative_identifiers"
        label="Alternative Identifiers"
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
