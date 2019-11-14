import React from 'react';
import {
  AccordionField,
  ArrayField,
  DeleteActionButton,
  GroupField,
  StringField,
  TextField,
  YearInputField,
} from '@forms';

export class PublicationInfoField extends React.Component {
  renderPublication = ({ arrayPath, indexPath, ...arrayHelpers }) => {
    const objectPath = `${arrayPath}.${indexPath}`;
    return (
      <GroupField
        grouped
        border
        action={
          <DeleteActionButton onClick={() => arrayHelpers.remove(indexPath)} />
        }
      >
        <StringField
          fieldPath={`${objectPath}.artid`}
          label="Article ID"
          optimized
        />
        <GroupField widths="equal">
          <StringField
            fieldPath={`${objectPath}.journal_title`}
            label="Title"
            optimized
          />
          <StringField
            fieldPath={`${objectPath}.journal_volume`}
            label="Volume"
            optimized
          />
          <StringField
            fieldPath={`${objectPath}.journal_issue`}
            label="Issue"
            optimized
          />
        </GroupField>
        <GroupField widths="equal">
          <StringField
            fieldPath={`${objectPath}.pages`}
            label="Pages"
            optimized
          />
          <YearInputField
            fieldPath={`${objectPath}.year`}
            label="Year"
            optimized
          />
        </GroupField>
        <TextField fieldPath={`${objectPath}.note`} label="Note" optimized />
      </GroupField>
    );
  };

  render() {
    return (
      <AccordionField
        label="Publication Info"
        fieldPath="publication_info"
        content={
          <ArrayField
            fieldPath="publication_info"
            defaultNewValue={{
              artid: '',
              journal_issue: '',
              journal_record: {
                $ref: '',
              },
              journal_title: '',
              journal_volume: '',
              note: '',
              pages: '',
              year: '',
            }}
            renderArrayItem={this.renderPublication}
            addButtonLabel="Add publication"
          />
        }
      />
    );
  }
}
