import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IsoLanguages from 'iso-639-1';
import { SelectField } from '../core';

export class LanguagesField extends Component {
  constructor(props) {
    super(props);
    this.languageCodes = this.getLanguageCodes();
    this.fieldPath = props.fieldPath;
  }

  getLanguageCodes = () => {
    return IsoLanguages.getAllCodes().map((code, index) => ({
      text: code,
      value: code,
    }));
  };
  render() {
    return (
      <SelectField
        multiple
        search
        label="Languages"
        fieldPath={this.fieldPath}
        options={this.languageCodes}
        upward={false}
      />
    );
  }
}

LanguagesField.propTypes = {
  fieldPath: PropTypes.object,
};

LanguagesField.defaultProps = {
  fieldPath: 'languages',
};
