import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { DatePicker } from '@components';
import { withState } from 'react-searchkit';
import _isEmpty from 'lodash/isEmpty';

export class _SearchDateRange extends Component {
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

  /** react-searchkit allows having the same filter multiple times with
   * different values. For this range dates filters, we want each filter to
   * appear only one time with one value (e.g. loan_start_date = `<date>`)
   */
  onDateChange = newFilter => {
    const { currentQueryState, updateQueryState } = this.props;
    const [name, value] = newFilter;
    const filters = currentQueryState.filters.filter(
      filter => filter[0] === name
    );
    if (!_isEmpty(value)) filters.push(newFilter);
    return updateQueryState({ filters: filters });
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

_SearchDateRange.propTypes = {
  currentQueryState: PropTypes.object.isRequired,
  updateQueryState: PropTypes.func.isRequired,
};
