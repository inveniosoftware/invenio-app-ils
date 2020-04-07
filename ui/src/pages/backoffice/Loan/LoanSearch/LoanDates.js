import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { invenioConfig } from '@config';
import { Icon, List } from 'semantic-ui-react';

export class LoanDates extends Component {
  render() {
    const { loan } = this.props;
    const isRequest = invenioConfig.circulation.loanRequestStates.includes(
      loan.metadata.state
    );
    return isRequest ? (
      <>
        <List.Content floated="right">
          {loan.metadata.request_start_date}
        </List.Content>
        <List.Content>
          <label> Requested on </label>
        </List.Content>
        <List.Content floated="right">
          {loan.metadata.request_expire_date}
        </List.Content>
        <List.Content>
          <label> Expires on </label>
        </List.Content>
      </>
    ) : (
      <>
        <List.Content floated="right">{loan.metadata.start_date}</List.Content>
        <List.Content>
          <label> Start date </label>
        </List.Content>
        <List.Content floated="right">
          {loan.metadata.is_overdue && <Icon name="warning" />}
          {loan.metadata.end_date}
        </List.Content>
        <List.Content>
          <label> End date </label>
        </List.Content>
      </>
    );
  }
}

LoanDates.propTypes = {
  loan: PropTypes.object.isRequired,
};
