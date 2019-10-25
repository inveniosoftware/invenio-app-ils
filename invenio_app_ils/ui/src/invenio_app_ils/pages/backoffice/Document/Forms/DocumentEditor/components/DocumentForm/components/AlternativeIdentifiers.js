import React, { Component } from 'react';
import { IdentifiersField } from '../../../../../../../../forms';

export class AlternativeIdentifiers extends Component {
  render() {
    return (
      <IdentifiersField
        fieldPath="alternative_identifiers"
        label="Alternative Identifiers"
      />
    );
  }
}
