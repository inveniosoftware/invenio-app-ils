import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import {
  AccordionField,
  ArrayField,
  StringField,
  LanguagesField,
} from '../../../../../../../../forms';

export class AlternativeTitles extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <>
        <StringField
          label="Alternative title"
          fieldPath={`${arrayPath}.${indexPath}.value`}
          required
        />
        <LanguagesField fieldPath={`${arrayPath}.${indexPath}.language`} />
        <StringField
          label="Source of the title"
          fieldPath={`${arrayPath}.${indexPath}.source`}
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
      </>
    );
  }

  render() {
    return (
      <AccordionField label="Alternative titles" fieldPath="alternative_titles">
        <ArrayField
          fieldPath="alternative_titles"
          defaultNewValue={{ value: '', source: '', language: '' }}
          renderArrayItem={this.renderFormField}
          addButtonLabel="Add new title"
        />
      </AccordionField>
    );
  }
}
