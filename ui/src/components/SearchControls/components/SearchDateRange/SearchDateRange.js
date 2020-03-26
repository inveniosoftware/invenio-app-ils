import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import { DatePicker } from '@components';
import { loan as loanApi } from '@api/loans/loan';

export class SearchDateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromDate: '',
      toDate: '',
    };
  }

  async fetchLoans() {
    const resp = await loanApi.inDateRange(
      this.state.fromDate,
      this.state.toDate
    );
    console.log('Resp', resp);
  }

  handleFromDateChange = value => {
    this.setState({ fromDate: value }, this.fetchLoans);
  };

  handleToDateChange = value => {
    this.setState({ toDate: value }, this.fetchLoans);
  };

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>Date</Card.Header>
        </Card.Content>
        <Card.Content>
          <DatePicker
            maxDate={this.state.toDate}
            placeholder="From"
            handleDateChange={this.handleFromDateChange}
          />
        </Card.Content>
        <Card.Content>
          <DatePicker
            minDate={this.state.fromDate}
            placeholder="To"
            handleDateChange={this.handleToDateChange}
          />
        </Card.Content>
      </Card>
    );
  }
}
