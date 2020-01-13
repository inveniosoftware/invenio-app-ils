import React, { Component } from 'react';
import {
  AccordionField,
  ArrayField,
  StringField,
  GroupField,
  BooleanField,
  VocabularyField,
  DeleteActionButton,
} from '@forms';

export class AccessUrls extends Component {
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
        <BooleanField
          toggle
          fieldPath={`${objectPath}.open_access`}
          label="Open Access"
        />
        <VocabularyField
          type="series_url_access_restriction"
          fieldPath={`${objectPath}.access_restriction`}
          label="Access Restriction"
        />
      </GroupField>
    );
  }

  render() {
    return (
      <AccordionField
        label="Access urls"
        fieldPath="access_urls"
        content={
          <ArrayField
            fieldPath="access_urls"
            defaultNewValue={{ url: '', description: '', open_access: true }}
            renderArrayItem={this.renderFormField.bind(this)}
            addButtonLabel="Add new access url"
          />
        }
      />
    );
  }
}
