import React from 'react';
import {
  AccordionField,
  ArrayField,
  DeleteActionButton,
  GroupField,
  IdentifiersField,
  StringField,
} from '../../../../../../../../../forms';

export class AuthorForm extends React.Component {
  renderAffiliation = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const path = `${arrayPath}.${indexPath}`;
    return (
      <GroupField
        basic
        border
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <StringField
          required
          fluid
          label="Affiliation Name"
          fieldPath={`${path}.name`}
        />
        <GroupField grouped widths="equal">
          <IdentifiersField basic fieldPath={`${path}.identifiers`} label="" />
        </GroupField>
      </GroupField>
    );
  };

  renderAlternativeName = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    return (
      <GroupField basic>
        <StringField
          label="Alternative name"
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
  };

  renderRole = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    return (
      <GroupField basic>
        <StringField
          label="Role"
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
  };

  render() {
    const { basePath } = this.props;
    return (
      <GroupField basic>
        <GroupField widths="equal">
          <StringField
            required
            fieldPath={`${basePath}.full_name`}
            label="Full name"
          />
          <StringField fieldPath={`${basePath}.type`} label="Type" />
        </GroupField>
        <AccordionField
          label="Affiliations"
          fieldPath="affiliations"
          content={
            <ArrayField
              fieldPath={`${basePath}.affiliations`}
              defaultNewValue={{ name: '', identifiers: [] }}
              renderArrayItem={this.renderAffiliation}
              addButtonLabel="Add affiliation"
            />
          }
        />
        <AccordionField
          label="Alternative Names"
          fieldPath="alternative_names"
          content={
            <ArrayField
              fieldPath={`${basePath}.alternative_names`}
              defaultNewValue=""
              renderArrayItem={this.renderAlternativeName}
              addButtonLabel="Add alternative name"
            />
          }
        />
        <IdentifiersField fieldPath={`${basePath}.identifiers`} />
        <AccordionField
          label="Roles"
          fieldPath={`${basePath}.roles`}
          content={
            <ArrayField
              fieldPath={`${basePath}.roles`}
              defaultNewValue=""
              renderArrayItem={this.renderRole}
              addButtonLabel="Add role"
            />
          }
        />
      </GroupField>
    );
  }
}
