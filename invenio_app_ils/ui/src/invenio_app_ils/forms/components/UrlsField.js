import React, { Component } from 'react';
import { AccordionField, ArrayField, StringField, GroupField } from '../core';
import { DeleteActionButton } from './DeleteActionButton';

export class UrlsField extends Component {
  renderFormField({ arrayPath, indexPath, ...arrayHelpers }) {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <GroupField
        border
        widths="equal"
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <StringField label="Url" fieldPath={`${objectPath}.value`} />
        <StringField
          label="Description"
          fieldPath={`${objectPath}.description`}
        />
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Urls"
        fieldPath="urls"
        content={
          <ArrayField
            fieldPath="urls"
            defaultNewValue={{ value: '', description: '' }}
            renderArrayItem={this.renderFormField}
            addButtonLabel="Add new url"
          />
        }
      />
    );
  }
}
