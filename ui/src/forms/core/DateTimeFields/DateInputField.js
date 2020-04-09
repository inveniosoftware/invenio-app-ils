import { fromISO, toShortDate } from '@api/date';
import { DatePicker } from '@components/DatePicker/DatePicker';
import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'semantic-ui-react';
import { CalendarInputField } from './CalendarInputField';

export class DateInputField extends React.Component {
  renderFormField = props => {
    return (
      <Form.Field required={this.props.required}>
        <label>{this.props.label}</label>
        <DatePicker
          id={this.props.fieldPath}
          name={this.props.fieldPath}
          placeholder={this.props.placeholder}
          error={props.error}
          defaultValue={toShortDate(props.value)}
          handleBlur={props.form.handleBlur}
          handleDateChange={(value, name) => {
            props.onChange(fromISO(value), name);
          }}
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

DateInputField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

DateInputField.defaultProps = {
  label: '',
  placeholder: '',
};
