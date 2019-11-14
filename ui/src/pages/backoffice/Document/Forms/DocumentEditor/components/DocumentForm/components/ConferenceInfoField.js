import React from 'react';
import {
  AccordionField,
  CountryField,
  GroupField,
  IdentifiersField,
  StringField,
  YearInputField,
} from '@forms';
import { invenioConfig } from '@config';

export class ConferenceInfoField extends React.Component {
  render() {
    const conferenceConfig = invenioConfig.vocabularies.document.conferenceInfo;
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
              optimized
            />
            <GroupField widths="equal">
              <StringField
                required
                fieldPath="conference_info.place"
                label="Place"
                optimized
              />
              <CountryField
                fieldPath="conference_info.country"
                label="Country"
                type={conferenceConfig.country}
                optimized
              />
            </GroupField>
            <GroupField widths="equal">
              <StringField
                fieldPath="conference_info.acronym"
                label="Acronym"
                optimized
              />
              <StringField
                fieldPath="conference_info.series"
                label="Series"
                optimized
              />
            </GroupField>
            <GroupField widths="equal">
              <StringField
                fieldPath="conference_info.dates"
                label="Dates"
                optimized
              />
              <YearInputField
                fieldPath="conference_info.year"
                label="Year"
                optimized
              />
            </GroupField>
            <IdentifiersField
              fieldPath="conference_info.identifiers"
              schemeVocabularyType={conferenceConfig.identifier.scheme}
            />
          </>
        }
      />
    );
  }
}
