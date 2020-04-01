import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import { DatePicker } from '@components';
import { withState } from 'react-searchkit';
import _isEmpty from 'lodash/isEmpty';

class _SearchDateRange extends Component {
  getCurrentDates() {
    const { filters } = this.props.currentQueryState;
    let fromDate = '';
    let toDate = '';

    filters.forEach(([name, value]) => {
      if (name === 'loans_from_date') fromDate = value;
      if (name === 'loans_to_date') toDate = value;
    });
    return [fromDate, toDate];
  }

  /** react-searchkit allows having the same filter multiple times.
   * For the range dates filters we want each filter one time only so we have
   * to remove any pre-existing filters with the same name
   */
  onDateChange = newFilter => {
    const [name, value] = newFilter;
    let filters = newFilter;
    // If value is empty we simply remove the filter otherwise if we have
    // value we remove the filter and add the new one.
    if (!_isEmpty(value)) filters = [[name, ''], newFilter];
    return this.props.updateQueryState({ filters: filters });
  };

  render() {
    const [fromDate, toDate] = this.getCurrentDates();

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
            handleDateChange={value =>
              this.onDateChange(['loans_from_date', value])
            }
          />
        </Card.Content>
        <Card.Content>
          <DatePicker
            minDate={fromDate}
            defaultValue={toDate}
            placeholder="To"
            handleDateChange={value =>
              this.onDateChange(['loans_to_date', value])
            }
          />
        </Card.Content>
      </Card>
    );
  }
}

export const SearchDateRange = withState(_SearchDateRange);
