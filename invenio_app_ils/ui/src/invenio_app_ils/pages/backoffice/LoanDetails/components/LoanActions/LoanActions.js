import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';

export default class LoanActions extends Component {
  constructor(props) {
    super(props);
    this.performLoanAction = this.props.performLoanAction;
  }

  renderAvailableActions(pid, loan, actions = {}) {
    return Object.keys(actions).map(action => {
      return (
        <List.Item key={action}>
          <Button
            primary
            onClick={() => {
              this.performLoanAction(pid, loan, actions[action]);
            }}
          >
            {action}
          </Button>
        </List.Item>
      );
    });
  }

  render() {
    const {
      availableActions,
      loan_pid: pid,
      document_pid,
      patron_pid,
      item_pid,
    } = this.props.loanDetails;
    const loan = {
      document_pid: document_pid,
      patron_pid: patron_pid,
      item_pid: item_pid,
    };

    if (availableActions) {
      return (
        <List horizontal>
          {Object.keys(availableActions).length ? (
            this.renderAvailableActions(pid, loan, availableActions)
          ) : (
            <List.Header as="h3">No actions available</List.Header>
          )}
        </List>
      );
    } else {
      return (
        <List horizontal>
          <List.Header as="h3">No actions available</List.Header>
        </List>
      );
    }
  }
}

LoanActions.propTypes = {
  loanDetails: PropTypes.object.isRequired,
  performLoanAction: PropTypes.func,
};
