import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import {
  AccordionField,
  ArrayField,
  StringField,
} from '../../../../../../../../forms';

export class TableOfContent extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <StringField
        fieldPath={`${arrayPath}.${indexPath}`}
        action={
          <Form.Button
            color="red"
            icon="trash"
            type="button"
            onClick={() => {
              arrayHelpers.remove(indexPath);
            }}
          ></Form.Button>
        }
      />
    );
  }

  render() {
    return (
      <AccordionField label="Table of content" fieldPath="table_of_content">
        <ArrayField
          fieldPath="table_of_content"
          defaultNewValue=""
          renderArrayItem={this.renderFormField}
          addButtonLabel="Add new chapter"
        />
      </AccordionField>
    );
  }
}
