import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  StringField,
  TextField,
  GroupField,
  DeleteActionButton,
} from '../../../../../../../../forms';

export class InternalNotes extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField
        basic
        border
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <TextField
          required
          label="Note"
          fieldPath={`${arrayPath}.${indexPath}.value`}
          rows={5}
        />
        <GroupField widths="equal">
          <StringField
            label="Refers to field"
            fieldPath={`${arrayPath}.${indexPath}.field`}
          />
          <StringField
            label="Created by"
            fieldPath={`${arrayPath}.${indexPath}.user`}
          />
        </GroupField>
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Internal notes"
        fieldPath="internal_notes"
        content={
          <ArrayField
            fieldPath="internal_notes"
            defaultNewValue=""
            renderArrayItem={this.renderFormField}
            addButtonLabel="Add new note"
          />
        }
      />
    );
  }
}
