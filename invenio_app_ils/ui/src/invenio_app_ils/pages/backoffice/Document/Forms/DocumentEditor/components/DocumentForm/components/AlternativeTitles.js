import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import {
  AccordionField,
  ArrayField,
  StringField,
  SelectField,
} from '../../../../../../../../forms';
import IsoLanguages from 'iso-639-1';

export class AlternativeTitles extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    this.languageCodes = IsoLanguages.getAllCodes().map((code, index) => ({
      text: code,
      value: code,
    }));
    return (
      <>
        <StringField
          label="Alternative title"
          fieldPath={`${arrayPath}.${indexPath}.value`}
          required
        />
        <SelectField
          clearable
          search
          label="Languages"
          fieldPath={`${arrayPath}.${indexPath}.language`}
          options={this.languageCodes}
          upward={false}
        />
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
