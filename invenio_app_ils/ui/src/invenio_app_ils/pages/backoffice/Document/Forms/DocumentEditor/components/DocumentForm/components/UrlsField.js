import React, { Component } from 'react';
import { ObjectArrayStringField } from '../../../../../../../../forms';

export class UrlsField extends Component {
  render() {
    return (
      <ObjectArrayStringField
        fieldPath="urls"
        label="Urls"
        objectKeysArray={[
          { key: 'value', text: 'Url', required: true },
          { key: 'description', text: 'Description' },
        ]}
        defaultNewValue={{ value: '', description: '' }}
        addButtonLabel="Add new url"
      />
    );
  }
}
