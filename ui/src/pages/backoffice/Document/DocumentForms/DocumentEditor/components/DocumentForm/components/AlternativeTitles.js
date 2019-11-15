import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  StringField,
  LanguageField,
  DeleteActionButton,
  GroupField,
  VocabularyField,
} from '@forms';
import { invenioConfig } from '@config';

export class AlternativeTitles extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField
        border
        widths="equal"
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <StringField
          required
          label="Alternative title"
          fieldPath={`${arrayPath}.${indexPath}.value`}
          optimized
        />
        <StringField
          label="Source of the title"
          fieldPath={`${arrayPath}.${indexPath}.source`}
          optimized
        />
        <LanguageField
          fieldPath={`${arrayPath}.${indexPath}.language`}
          type={invenioConfig.vocabularies.document.alternativeTitle.language}
          optimized
        />
        <VocabularyField
          type={invenioConfig.vocabularies.document.alternativeTitle.type}
          fieldPath={`${arrayPath}.${indexPath}.type`}
          label="Type"
        />
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Alternative titles"
        fieldPath="alternative_titles"
        content={
          <ArrayField
            fieldPath="alternative_titles"
            defaultNewValue={{ value: '', source: '', language: '' }}
            renderArrayItem={this.renderFormField}
            addButtonLabel="Add new title"
          />
        }
      />
    );
  }
}
