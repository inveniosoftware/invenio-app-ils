import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import {
  AccordionField,
  ArrayField,
  TextField,
} from '../../../../../../../../forms';

export class AlternativeAbstracts extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <>
        <TextField fieldPath={`${arrayPath}.${indexPath}`} width={14} />
        <Form.Button
          color="red"
          icon="trash"
          type="button"
          onClick={() => {
            arrayHelpers.remove(indexPath);
          }}
        ></Form.Button>
      </>
    );
  }

  render() {
    return (
      <AccordionField
        label="Alternative abstracts"
        fieldPath="alternative_abstracts"
      >
        <ArrayField
          fieldPath="alternative_abstracts"
          defaultNewValue=""
          renderArrayItem={this.renderFormField}
          addButtonLabel="Add new abstract"
        />
      </AccordionField>
    );
  }
}
