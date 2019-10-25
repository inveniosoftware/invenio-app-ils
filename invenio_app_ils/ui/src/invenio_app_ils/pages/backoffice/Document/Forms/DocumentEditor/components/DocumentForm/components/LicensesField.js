import React from 'react';
import PropTypes from 'prop-types';
import { AccordionField, ArrayField, DeleteActionButton, GroupField, StringField, IdentifiersField } from '../../../../../../../../forms';

export class LicensesField extends React.Component {
  renderLicense = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <GroupField
        grouped
        border
        title="License"
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <GroupField widths="equal">
          <StringField
            fieldPath={`${objectPath}.funder`}
            label="Funder"
          />
          <StringField
            fieldPath={`${objectPath}.statement`}
            label="Statement"
          />
          <StringField
            fieldPath={`${objectPath}.url`}
            label="URL"
          />
        </GroupField>
        <AccordionField
          label="Identifier"
          fieldPath={`${objectPath}.identifier`}
        >
          <GroupField widths="equal">
            <StringField
              required
              fieldPath={`${objectPath}.identifier.scheme`}
              label="Scheme"
            />
            <StringField
              fieldPath={`${objectPath}.identifier.value`}
              label="Value"
            />
          </GroupField>
        </AccordionField>
      </GroupField>
    );
  };

  render() {
    return (
      <AccordionField label="Licenses" fieldPath="licenses">
        <ArrayField
          fieldPath="licenses"
          defaultNewValue={{}}
          renderArrayItem={this.renderLicense}
          addButtonLabel="Add license"
        />
      </AccordionField>
    );
  }
}
