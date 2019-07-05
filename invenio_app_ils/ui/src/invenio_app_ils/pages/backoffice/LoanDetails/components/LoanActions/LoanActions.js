import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import { omit } from 'lodash/object';
import { CancelLoanModal } from '../CancelLoanModal';

export default class LoanActions extends Component {
  constructor(props) {
    super(props);
    this.performLoanAction = this.props.performLoanAction;
  }

  renderAvailableActions(pid, loan, actions = {}) {
    if ('checkout' in actions && loan.metadata.state === 'PENDING') {
      actions = omit(actions, 'checkout');
    }
    return Object.keys(actions).map(action => {
      const cancelAction = (cancelReason = null) =>
        this.performLoanAction(pid, loan, actions[action], cancelReason);
      const loanAction = () =>
        this.performLoanAction(pid, loan, actions[action]);
      return (
        <List.Item key={action}>
          {action === 'cancel' ? (
            <CancelLoanModal
              loan={this.props.loanDetails}
              action={cancelAction}
            />
          ) : (
            <Button primary onClick={loanAction}>
              {action}
            </Button>
          )}
        </List.Item>
      );
    });
  }

  render() {
    const { availableActions, loan_pid: pid } = this.props.loanDetails;
    const {
      document_pid,
      patron_pid,
      item_pid,
      state,
    } = this.props.loanDetails.metadata;
    const loan = {
      metadata: {
        document_pid: document_pid,
        patron_pid: patron_pid,
        item_pid: item_pid,
        state: state,
      },
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
