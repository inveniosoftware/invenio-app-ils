import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import {
  AccordionField,
  ArrayField,
  StringField,
  DatePickerField,
  DeleteActionButton,
  GroupField,
} from '../../../../../../../../forms';

export class Copyrights extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField
        border
        widths="equal"
        action={
          <DeleteActionButton
            size="large"
            onClick={() => arrayHelpers.remove(indexPath)}
          />
        }
      >
        <StringField
          label="Copyright handler name"
          fieldPath={`${arrayPath}.${indexPath}.holder`}
        />
        <DatePickerField
          label="Year"
          mode="year"
          fieldPath={`${arrayPath}.${indexPath}.year`}
        />
        <StringField
          label="Copyright handler name"
          fieldPath={`${arrayPath}.${indexPath}.holder`}
        />
        <StringField
          label="Copyright notice"
          fieldPath={`${arrayPath}.${indexPath}.statement`}
        />
        <StringField
          label="Refers to material"
          fieldPath={`${arrayPath}.${indexPath}.material`}
        />
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField label="Copyrights" fieldPath="copyrights">
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
      </AccordionField>
    );
  }
}
