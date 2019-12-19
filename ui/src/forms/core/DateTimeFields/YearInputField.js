import React from 'react';
import PropTypes from 'prop-types';
import { CalendarInputField } from './CalendarInputField';
import { YearPicker } from '@components';
import { Form } from 'semantic-ui-react';

export class YearInputField extends React.Component {
  renderFormField = props => {
    return (
      <Form.Field required={this.props.required}>
        <label>{this.props.label}</label>
        <YearPicker
          id={this.props.fieldPath}
          name={this.props.fieldPath}
          placeholder={this.props.placeholder}
          error={props.error}
          defaultValue={`${props.value}`}
          handleBlur={props.form.handleBlur}
          handleYearChange={props.onChange}
        />
      </Form.Field>
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
