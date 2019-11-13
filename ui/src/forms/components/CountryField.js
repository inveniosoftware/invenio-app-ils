import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VocabularyField } from '../core';
import { Dropdown, Flag } from 'semantic-ui-react';
import { names as FLAG_NAMES } from 'semantic-ui-react/dist/commonjs/elements/Flag/Flag';
import cx from 'classnames';
import get from 'lodash/get';

export class FlagDropdown extends Dropdown {
  renderText = () => {
    const { multiple, placeholder, search, text } = this.props;
    const { searchQuery, value, open } = this.state;
    const hasValue = this.hasValue();

    const classes = cx(
      placeholder && !hasValue && 'default',
      'text',
      search && searchQuery && 'filtered'
    );
    let _text = placeholder;
    let _flag = null;

    if (text) {
      _text = text;
    } else if (open && !multiple) {
      _text = get(this.getSelectedItem(), 'text');
    } else if (hasValue) {
      const item = this.getItemByValue(value);
      _text = get(item, 'text');
      if (item && item.flag) {
        _flag = <Flag name={item.flag} />;
      }
    }

    // Render the flag along with the text
    return (
      <div className={classes} role="alert" aria-live="polite" aria-atomic>
        {_flag}
        {_text}
      </div>
    );
  };
}

export class CountryField extends Component {
  serializer = hit => {
    const obj = {
      key: hit.metadata.id,
      value: hit.metadata.key,
      text: hit.metadata.text,
    };
    const code = obj.value.toLowerCase();
    if (FLAG_NAMES.includes(code)) {
      obj.flag = code;
    }
    return obj;
  };

  render() {
    return (
      <VocabularyField
        multiple={this.props.multiple}
        type={this.props.type}
        fieldPath={this.props.fieldPath}
        label="Countries"
        placeholder="Search for a country..."
        serializer={this.serializer}
        control={FlagDropdown}
      />
    );
  }
}

CountryField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

CountryField.defaultProps = {
  multiple: false,
};
