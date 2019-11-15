import React, { Component } from 'react';
import { ObjectArrayField, StringField, VocabularyField } from '@forms';
import { invenioConfig } from '@config';

export class Identifiers extends Component {
  render() {
    return (
      <ObjectArrayField
        accordion
        fieldPath="identifiers"
        label="Identifiers"
        defaultNewValue={{
          scheme: '',
          value: '',
          material: '',
        }}
        objects={[
          {
            key: 'scheme',
            element: VocabularyField,
            props: {
              type: invenioConfig.vocabularies.document.identifier.scheme,
              label: 'Scheme',
            },
          },
          {
            key: 'value',
            element: StringField,
            props: {
              inline: true,
              label: 'Value',
              required: true,
              optimized: true,
            },
          },
          {
            key: 'material',
            element: StringField,
            props: { inline: true, label: 'Material', optimized: true },
          },
        ]}
      />
    );
  }
}
