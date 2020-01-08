import React, { Component } from 'react';
import {
  AccordionField,
  StringField,
  GroupField,
  DateInputField,
} from '@forms';

export class Imprint extends Component {
  render() {
    return (
      <AccordionField
        label="Imprint"
        fieldPath="imprint"
        content={
          <>
            <GroupField widths="equal">
              <StringField
                label="Publisher"
                fieldPath={'imprint.publisher'}
                optimized
              />
              <DateInputField
                label="Date of publication"
                fieldPath={'imprint.date'}
                optimized
              />
            </GroupField>
            <GroupField widths="equal">
              <StringField
                label="Place of publication"
                fieldPath={'imprint.place'}
                optimized
              />
              <DateInputField
                label="Date of reprint"
                fieldPath={'imprint.reprint_date'}
                optimized
              />
            </GroupField>
          </>
        }
      />
    );
  }
}
