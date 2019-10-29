import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  StringField,
  DeleteActionButton,
  GroupField,
} from '../../../../../../../../forms';

export class TableOfContent extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField basic>
        <StringField
          fieldPath={`${arrayPath}.${indexPath}`}
          action={
            <DeleteActionButton
              icon="trash"
              onClick={() => arrayHelpers.remove(indexPath)}
            />
          }
        />
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Table of content"
        fieldPath="table_of_content"
        content={
          <ArrayField
            fieldPath="table_of_content"
            defaultNewValue=""
            renderArrayItem={this.renderFormField}
            addButtonLabel="Add new chapter"
          />
        }
      />
    );
  }
}
