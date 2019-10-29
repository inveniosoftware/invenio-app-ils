import React from 'react';
import {
  GroupField,
  StringField,
  AccordionField,
  IdentifiersField,
  YearInputField,
} from '../../../../../../../../forms';

export class ConferenceInfoField extends React.Component {
  render() {
    return (
      <AccordionField
        label="Conference Info"
        fieldPath="conference_info"
        content={
          <>
            <StringField
              required
              fieldPath="conference_info.title"
              label="Title"
            />
            <GroupField widths="equal">
              <StringField
                required
                fieldPath="conference_info.place"
                label="Place"
              />
              <StringField
                fieldPath="conference_info.country"
                label="Country"
              />
            </GroupField>
            <GroupField widths="equal">
              <StringField
                fieldPath="conference_info.acronym"
                label="Acronym"
              />
              <StringField fieldPath="conference_info.series" label="Series" />
            </GroupField>
            <GroupField widths="equal">
              <StringField fieldPath="conference_info.dates" label="Dates" />
              <YearInputField fieldPath="conference_info.year" label="Year" />
            </GroupField>
            <IdentifiersField fieldPath="conference_info.identifiers" />
          </>
        }
      />
    );
  }
}
