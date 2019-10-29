import React, { Component } from 'react';
import {
  AccordionField,
  StringField,
  GroupField,
} from '../../../../../../../../forms';

export class Keywords extends Component {
  render() {
    return (
      <AccordionField
        label="Keywords"
        fieldPath="keywords"
        content={
          <GroupField widths="equal">
            <StringField label="Source" fieldPath="keywords.source" />
            <StringField label="Value" fieldPath="keywords.value" />
          </GroupField>
        }
      />
    );
  }
}
