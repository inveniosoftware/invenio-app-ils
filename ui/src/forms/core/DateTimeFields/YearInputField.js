import React from 'react';
import PropTypes from 'prop-types';
import { CalendarInputField } from './CalendarInputField';
import { YearPicker } from '../../../common/components';

export class YearInputField extends React.Component {
  renderFormField = props => {
    return (
      <YearPicker
        id={this.props.fieldPath}
        name={this.props.fieldPath}
        error={props.error}
        label={this.props.label}
        placeholder={this.props.placeholder}
        defaultValue={`${props.value}`}
        handleBlur={props.form.handleBlur}
        handleYearChange={props.onChange}
      />
    );
  };

  render() {
    return (
      <CalendarInputField
        fieldPath={this.props.fieldPath}
        component={this.renderFormField}
      />
    );
  }
}

YearInputField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

YearInputField.defaultProps = {
  label: '',
  placeholder: '',
};
