import React, { Component } from 'react';
import { ObjectArrayStringField } from '../../../../../../../../forms';

export class Subjects extends Component {
  render() {
    return (
      <ObjectArrayStringField
        fieldPath="subjects"
        label="Subjects"
        objectKeysArray={[
          { key: 'scheme', text: 'Scheme', required: true },
          { key: 'value', text: 'Subject value', required: true },
        ]}
        defaultNewValue={{ scheme: '', value: '' }}
        addButtonLabel="Add new subject"
      />
    );
  }
}
