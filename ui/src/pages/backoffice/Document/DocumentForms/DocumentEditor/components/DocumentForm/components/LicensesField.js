import React from 'react';
import { AccordionField, VocabularyField } from '@forms';
import { invenioConfig } from '@config';

export class LicensesField extends React.Component {
  render() {
    return (
      <AccordionField
        label="Licenses"
        fieldPath="licenses"
        content={
          <VocabularyField
            multiple
            type={invenioConfig.vocabularies.document.license}
            fieldPath="licenses"
          />
        }
      />
    );
  }
}
