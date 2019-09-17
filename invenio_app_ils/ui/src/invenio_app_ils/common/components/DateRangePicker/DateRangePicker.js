import React, { Component } from 'react';
import { Icon, Segment } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import PropTypes from 'prop-types';

export class DateRangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: props.defaultStart ? props.defaultStart : '',
      toDate: props.defaultEnd ? props.defaultEnd : '',
    };
  }

  handleDateChange = (event, { name, value }) => {
    this.setState({ [name]: value });
    if (this.props.handleDateChange) {
      this.props.handleDateChange(name, value);
    }
  };

  render() {
    return (
      <>
        <Segment>
          <DateInput
            autoComplete="off"
            clearable
            clearIcon={<Icon name="remove" color="red" />}
            closable
            dateFormat="YYYY-MM-DD"
            iconPosition="left"
            maxDate={this.state.toDate}
            name="fromDate"
            onChange={this.handleDateChange}
            placeholder="Start Date"
            value={this.state.fromDate}
            data-test={this.state.fromDate}
          />
        </Segment>
        <Segment>
          <DateInput
            autoComplete="off"
            clearable
            clearIcon={<Icon name="remove" color="red" />}
            closable
            dateFormat="YYYY-MM-DD"
            iconPosition="left"
            minDate={this.state.fromDate}
            name="toDate"
            onChange={this.handleDateChange}
            placeholder="End Date"
            value={this.state.toDate}
            data-test={this.state.toDate}
          />
        </Segment>
      </>
    );
  }
}

DateRangePicker.propTypes = {
  handleDateChange: PropTypes.func,
  defaultStart: PropTypes.string,
  defaultEnd: PropTypes.string,
};
