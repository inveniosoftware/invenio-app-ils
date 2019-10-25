import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import {
  AccordionField,
  ArrayField,
  StringField,
  TextField,
  GroupField,
} from '../../../../../../../../forms';

export class InternalNotes extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <>
        <TextField
          label="Note"
          fieldPath={`${arrayPath}.${indexPath}.value`}
          required
          rows={5}
        />
        <GroupField>
          <StringField
            label="Refers to field"
            fieldPath={`${arrayPath}.${indexPath}.field`}
          />
          <StringField
            label="Created by"
            fieldPath={`${arrayPath}.${indexPath}.user`}
            action={
              <Form.Button
                color="red"
                icon="trash"
                type="button"
                onClick={() => {
                  console.log(arrayHelpers);

                  arrayHelpers.remove(indexPath);
                }}
              ></Form.Button>
            }
          />
        </GroupField>
      </>
    );
  }

  render() {
    return (
      <AccordionField label="Internal notes" fieldPath="internal_notes">
        <ArrayField
          fieldPath="internal_notes"
          defaultNewValue=""
          renderArrayItem={this.renderFormField}
          addButtonLabel="Add new note"
        />
      </AccordionField>
    );
  }
}
