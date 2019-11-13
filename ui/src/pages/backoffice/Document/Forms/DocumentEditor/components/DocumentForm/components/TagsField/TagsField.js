import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VocabularyField } from '../../../../../../../../../forms';

export class TagsField extends Component {
  render() {
    return (
      <VocabularyField
        accordion
        multiple
        type={this.props.type}
        fieldPath={this.props.fieldPath}
        label={this.props.label}
        placeholder={this.props.placeholder}
      />
    );
  }
}

TagsField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};

TagsField.defaultProps = {
  label: 'Tags',
  placeholder: 'Search for a tag...',
};
