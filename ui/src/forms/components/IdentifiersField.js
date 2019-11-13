import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ObjectArrayField, VocabularyField, StringField } from '../core';

export class IdentifiersField extends Component {
  getObjects = () => [
    {
      key: 'scheme',
      element: VocabularyField,
      props: { type: this.props.schemeVocabularyType, label: 'Scheme' },
    },
    {
      key: 'value',
      element: StringField,
      props: { inline: true, label: 'Value', required: true },
    },
  ];

  render() {
    return (
      <ObjectArrayField
        accordion={this.props.accordion}
        fieldPath={this.props.fieldPath}
        label={this.props.label}
        objects={this.getObjects()}
        defaultNewValue={this.props.defaultNewValue}
        addButtonLabel={this.props.addButtonLabel}
      />
    );
  }
}

IdentifiersField.propTypes = {
  accordion: PropTypes.bool,
  addButtonLabel: PropTypes.string,
  defaultNewValue: PropTypes.object,
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  objects: PropTypes.array,
  schemeVocabularyType: PropTypes.string,
};

IdentifiersField.defaultProps = {
  addButtonLabel: 'Add new identifier',
  accordion: false,
  fieldPath: 'identifiers',
  label: 'Identifiers',
  defaultNewValue: { scheme: '', value: '' },
  schemeVocabularyType: 'identifier_scheme',
};
