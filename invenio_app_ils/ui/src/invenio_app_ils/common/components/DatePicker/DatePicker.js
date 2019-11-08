import React, { Component } from 'react';
import { DateInput } from 'semantic-ui-calendar-react';
import PropTypes from 'prop-types';

export class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: props.defaultValue,
    };
  }

  handleDateChange = (_, { name, value }) => {
    this.setState({ selectedDate: value });
    this.props.handleDateChange(value, name);
  };

  render() {
    return (
      <DateInput
        autoComplete="off"
        clearable
        closable
        iconPosition="left"
        initialDate={this.props.initialDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        error={this.props.error}
        label={this.props.label}
        id={this.props.id}
        name={this.props.name}
        onChange={this.handleDateChange}
        placeholder={this.props.placeholder}
        value={this.state.selectedDate}
        data-test={this.state.selectedDate}
        dateFormat={'YYYY-MM-DD'}
        animation="none"
      />
    );
  }
}

DatePicker.propTypes = {
  defaultValue: PropTypes.string,
  error: PropTypes.object,
  handleBlur: PropTypes.func,
  handleDateChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  initialDate: PropTypes.string,
  label: PropTypes.string,
  maxDate: PropTypes.string,
  minDate: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};

DatePicker.defaultProps = {
  initialDate: '',
  minDate: '',
  maxDate: '',
  defaultValue: '',
  placeholder: '',
  name: 'selectedDate',
};
