import React from 'react';
import { ArrayField, StringField, GroupField, AccordionField, IdentifiersField, DeleteActionButton } from '../../../../../../../../../forms';
import { Form } from 'semantic-ui-react';

export class AuthorForm extends React.Component {
  renderAffiliation = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <GroupField
        border
        widths="equal"
        title="Affiliation"
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <StringField
          required
          fluid
          label="Name"
          fieldPath={`${objectPath}.name`}
        />
        <GroupField grouped widths="equal">
          <IdentifiersField
            basic
            fieldPath={`${objectPath}.identifiers`}
            label=""
          />
        </GroupField>
      </GroupField>
    );
  };

  renderAlternativeName = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <StringField
        label="Alternative name"
        fieldPath={objectPath}
        action={
          <Form.Button
            negative
            icon="trash"
            onClick={() => {
              arrayHelpers.remove(indexPath);
            }}
          />
        }
      />
    );
  };

  renderRole = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <StringField
        label="Role"
        fieldPath={objectPath}
        action={
          <Form.Button
            negative
            icon="trash"
            onClick={() => {
              arrayHelpers.remove(indexPath);
            }}
          />
        }
      />
    );
  };

  render() {
    return (
      <GroupField grouped>
        <GroupField widths="equal">
          <StringField required fieldPath="full_name" label="Full name" />
          <StringField fieldPath="type" label="Type" />
        </GroupField>
        <AccordionField label="Affiliations" fieldPath="affiliations">
          <ArrayField
            fieldPath="affiliations"
            defaultNewValue={{ name: '', identifiers: [] }}
            renderArrayItem={this.renderAffiliation}
            addButtonLabel="Add affiliation"
          />
        </AccordionField>
        <AccordionField label="Alternative Names" fieldPath="alternative_names">
          <ArrayField
            fieldPath="alternative_names"
            defaultNewValue=""
            renderArrayItem={this.renderAlternativeName}
            addButtonLabel="Add alternative name"
          />
        </AccordionField>
        <IdentifiersField />
        <AccordionField label="Roles" fieldPath="roles">
          <ArrayField
            fieldPath="roles"
            defaultNewValue=""
            renderArrayItem={this.renderRole}
            addButtonLabel="Add role"
          />
        </AccordionField>
      </GroupField>
    );
  }
}