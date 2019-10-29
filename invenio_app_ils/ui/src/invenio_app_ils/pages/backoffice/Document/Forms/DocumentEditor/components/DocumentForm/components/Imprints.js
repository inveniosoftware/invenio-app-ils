import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  StringField,
  DeleteActionButton,
  GroupField,
  DateInputField,
} from '../../../../../../../../forms';

export class Imprints extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField
        basic
        border
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <GroupField widths="equal">
          <StringField
            label="Publisher"
            fieldPath={`${arrayPath}.${indexPath}.publisher`}
          />
          <DateInputField
            label="Date of publication"
            fieldPath={`${arrayPath}.${indexPath}.date`}
          />
        </GroupField>
        <GroupField widths="equal">
          <StringField
            label="Place of publication"
            fieldPath={`${arrayPath}.${indexPath}.place`}
          />
          <DateInputField
            label="Date of reprint"
            fieldPath={`${arrayPath}.${indexPath}.reprint_date`}
          />
        </GroupField>
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Imprints"
        fieldPath="imprints"
        content={
          <ArrayField
            fieldPath="imprints"
            defaultNewValue={{
              date: '',
              place: '',
              publisher: '',
              reprint_date: '',
            }}
            renderArrayItem={this.renderFormField}
            addButtonLabel="Add new imprint"
          />
        }
      />
    );
  }
}
