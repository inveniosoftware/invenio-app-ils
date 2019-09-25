import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import PropTypes from 'prop-types';

export class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: props.defaultValue,
    };
  }

  handleDateChange = (_, { value }) => {
    this.setState({ selectedDate: value });
    this.props.handleDateChange(value);
  };

  render() {
    return (
      <DateInput
        autoComplete="off"
        clearable
        clearIcon={<Icon name="remove" color="red" />}
        closable
        dateFormat="YYYY-MM-DD"
        iconPosition="left"
        initialDate={this.props.initialDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        name="selectedDate"
        onChange={this.handleDateChange}
        placeholder={this.props.placeholder}
        value={this.state.selectedDate}
        data-test={this.state.selectedDate}
      />
    );
  }
}

DatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  initialDate: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
};

DatePicker.defaultProps = {
  initialDate: '',
  minDate: '',
  maxDate: '',
  defaultValue: '',
  placeholder: '',
};
