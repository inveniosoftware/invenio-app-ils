import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  StringField,
  DeleteActionButton,
  GroupField,
  YearInputField,
} from '@forms';

export class Copyrights extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField
        border
        grouped
        widths="equal"
        action={
          <DeleteActionButton
            size="large"
            onClick={() => arrayHelpers.remove(indexPath)}
          />
        }
      >
        <GroupField widths="equal">
          <StringField
            label="Copyright holder"
            fieldPath={`${arrayPath}.${indexPath}.holder`}
            optimized
          />
          <StringField
            label="Copyright notice"
            fieldPath={`${arrayPath}.${indexPath}.statement`}
            optimized
          />
          <StringField
            label="Copyright notice URL"
            fieldPath={`${arrayPath}.${indexPath}.url`}
            optimized
          />
        </GroupField>
        <GroupField widths="equal">
          <YearInputField
            label="Year"
            mode="year"
            fieldPath={`${arrayPath}.${indexPath}.year`}
            optimized
          />
          <StringField
            label="Refers to material"
            fieldPath={`${arrayPath}.${indexPath}.material`}
            optimized
          />
        </GroupField>
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Copyrights"
        fieldPath="copyrights"
        content={
          <ArrayField
            fieldPath="copyrights"
            defaultNewValue={{
              holder: '',
              material: '',
              statement: '',
              url: '',
              year: '',
            }}
            renderArrayItem={this.renderFormField}
            addButtonLabel="Add new copyright"
          />
        }
      />
    );
  }
}
