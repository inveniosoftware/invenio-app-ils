import React, { Component } from 'react';
import {
  ArrayField,
  DeleteActionButton,
  GroupField,
  StringField,
} from '@forms';

export class Funds extends Component {
  renderArrayItem({ arrayPath, indexPath, ...arrayHelpers }) {
    return (
      <GroupField basic>
        <StringField
          fieldPath={`${arrayPath}.${indexPath}`}
          optimized
          action={
            <DeleteActionButton
              icon="trash"
              onClick={() => arrayHelpers.remove(indexPath)}
            />
          }
        />
      </GroupField>
    );
  }

  render() {
    return (
      <ArrayField
        fieldPath="funds"
        label="Funds"
        defaultNewValue=""
        renderArrayItem={this.renderArrayItem}
        addButtonLabel="Add new fund"
      />
    );
  }
}
