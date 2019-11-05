import React from 'react';
import {
  AccordionField,
  ArrayField,
  DeleteActionButton,
  GroupField,
  IdentifiersField,
  StringField,
  VocabularyField,
} from '../../../../../../../../../forms';
import { invenioConfig } from '../../../../../../../../../common/config';

export class AuthorForm extends React.Component {
  constructor(props) {
    super(props);
    this.authorVocabularies = invenioConfig.vocabularies.document.author;
  }

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
          <IdentifiersField
            basic
            fieldPath={`${path}.identifiers`}
            label=""
            schemeVocabularyType={
              this.authorVocabularies.affiliation.identifier.scheme
            }
          />
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
        <VocabularyField
          type={this.authorVocabularies.roles.type}
          fieldPath={`${arrayPath}.${indexPath}`}
          label="Role"
          placeholder="Select an author role..."
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
          <VocabularyField
            type={this.authorVocabularies.type}
            fieldPath={`${basePath}.type`}
            label="Type"
            placeholder="Select an author type..."
          />
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
        <IdentifiersField
          accordion
          fieldPath={`${basePath}.identifiers`}
          schemeVocabularyType={this.authorVocabularies.identifier.scheme}
        />
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
