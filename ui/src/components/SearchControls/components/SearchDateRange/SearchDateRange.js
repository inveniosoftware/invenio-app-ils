import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { DatePicker } from '@components';

export class SearchDateRange extends Component {
  render() {
    const { fromDate, toDate, onDateChange } = this.props;
    return (
      <Card>
        <Card.Content>
          <Card.Header>Date</Card.Header>
          <Card.Meta>
            <span>*Loan start date</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content>
          <DatePicker
            maxDate={toDate}
            defaultValue={fromDate}
            placeholder="From"
            handleDateChange={value => onDateChange({ fromDate: value })}
          />
        </Card.Content>
        <Card.Content>
          <DatePicker
            minDate={fromDate}
            defaultValue={toDate}
            placeholder="To"
            handleDateChange={value => onDateChange({ toDate: value })}
          />
        </Card.Content>
      </Card>
    );
  }
}

SearchDateRange.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};
