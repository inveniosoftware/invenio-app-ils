import React from 'react';
import PropTypes from 'prop-types';
import { GroupField, StringField, AccordionField, IdentifiersField } from '../../../../../../../../forms';
import { Form } from 'semantic-ui-react';

export class ConferenceInfoField extends React.Component {
  render() {
    return (
      <AccordionField label="Conference Info" fieldPath="conference_info">
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
          <StringField
            fieldPath="conference_info.series"
            label="Series"
          />
        </GroupField>
        <GroupField widths="equal">
          <StringField
            fieldPath="conference_info.dates"
            label="Dates"
          />
          <StringField
            fieldPath="conference_info.year"
            label="Year"
          />
        </GroupField>
        <IdentifiersField fieldPath="conference_info.identifiers" />
      </AccordionField>
    );
  }
}
