import React from 'react';
import PropTypes from 'prop-types';
import { CalendarInputField } from './CalendarInputField';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { Form } from 'semantic-ui-react';

export class DateTimeInputField extends React.Component {
  renderFormField = props => {
    return (
      <Form.Field required={this.props.required}>
        <label>{this.props.label}</label>
        <DateTimeInput
          id={this.props.fieldPath}
          name={this.props.fieldPath}
          clearable
          closable
          autoComplete="off"
          iconPosition="left"
          error={props.error}
          placeholder={props.placeholder}
          value={`${props.value}`}
          dateFormat="YYYY-MM-DD"
          onBlur={props.form.handleBlur}
          onChange={props.onChange}
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

DateTimeInputField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

DateTimeInputField.defaultProps = {
  label: '',
  placeholder: '',
};
