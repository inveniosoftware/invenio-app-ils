import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  TextField,
  GroupField,
  DeleteActionButton,
} from '../../../../../../../../forms';

export class AlternativeAbstracts extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField
        basic
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <TextField
          label="Abstract"
          fieldPath={`${arrayPath}.${indexPath}`}
          width={14}
        />
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Alternative abstracts"
        fieldPath="alternative_abstracts"
        content={
          <ArrayField
            fieldPath="alternative_abstracts"
            defaultNewValue=""
            renderArrayItem={this.renderFormField}
            addButtonLabel="Add new abstract"
          />
        }
      />
    );
  }
}
