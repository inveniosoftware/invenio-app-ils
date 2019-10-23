import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import {
  AccordionField,
  ArrayField,
  StringField,
} from '../../../../../../../../forms';

export class UrlsField extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    const objectPath = `${arrayPath}.${indexPath}`;
    console.log(objectPath);

    return (
      <>
        <StringField
          label="Url"
          fieldPath={`${objectPath}.value`}
          inline={true}
        />
        <StringField
          label="Description"
          fieldPath={`${objectPath}.description`}
          inline={true}
          action={
            <Form.Button
              color="red"
              icon="trash"
              onClick={() => {
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
      <AccordionField label="Urls" fieldPath="urls">
        <ArrayField
          fieldPath="urls"
          defaultNewValue={{ value: '', description: '' }}
          renderArrayItem={this.renderFormField}
        ></ArrayField>
      </AccordionField>
    );
  }
}
