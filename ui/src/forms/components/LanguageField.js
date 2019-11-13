import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VocabularyField } from '../core';

export class LanguageField extends Component {
  render() {
    const { multiple } = this.props;
    return (
      <VocabularyField
        multiple={multiple}
        type={this.props.type}
        fieldPath={this.props.fieldPath}
        label={multiple ? 'Languages' : 'Language'}
        placeholder={multiple ? 'Select languages...' : 'Select language'}
      />
    );
  }
}

LanguageField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

LanguageField.defaultProps = {
  multiple: false,
};
