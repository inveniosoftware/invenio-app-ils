import React, { Component } from 'react';
import { IdentifiersField } from '../../../../../../../../forms';

export class Identifiers extends Component {
  render() {
    return (
      <IdentifiersField
        fieldPath="identifiers"
        label="Identifiers"
        objectKeysArray={[
          { key: 'scheme', text: 'Scheme', required: true },
          { key: 'value', text: 'Identifier value', required: true },
          { key: 'material', text: 'Refers to material' },
        ]}
      />
    );
  }
}
