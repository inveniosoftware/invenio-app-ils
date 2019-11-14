import React, { Component } from 'react';
import { IdentifiersField } from '@forms';
import { invenioConfig } from '@config';

export class AlternativeIdentifiers extends Component {
  render() {
    return (
      <IdentifiersField
        accordion
        fieldPath="alternative_identifiers"
        label="Alternative Identifiers"
        schemeVocabularyType={
          invenioConfig.vocabularies.document.alternativeIdentifier.scheme
        }
      />
    );
  }
}
