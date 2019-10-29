import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  StringField,
  LanguagesField,
  DeleteActionButton,
  GroupField,
} from '../../../../../../../../forms';

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
        />
        <StringField
          label="Source of the title"
          fieldPath={`${arrayPath}.${indexPath}.source`}
        />
        <LanguagesField fieldPath={`${arrayPath}.${indexPath}.language`} />
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
