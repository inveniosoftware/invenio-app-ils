import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import { omit } from 'lodash/object';
import { CancelModal } from '@components/CancelModal';

export default class LoanActions extends Component {
  constructor(props) {
    super(props);
    this.performLoanAction = this.props.performLoanAction;
  }

  renderAvailableActions(pid, patronPid, documentPid, itemPid, actions = {}) {
    // omit checkout because it must done in one of the available items
    if (!itemPid) {
      actions = omit(actions, 'checkout');
    }

    return Object.keys(actions).map(action => {
      const cancelAction = (cancelReason = null) =>
        this.performLoanAction(actions[action], documentPid, patronPid, {
          cancelReason: cancelReason,
        });
      const loanAction = () =>
        this.performLoanAction(actions[action], documentPid, patronPid);
      return (
        <List.Item key={action}>
          {action === 'cancel' ? (
            <CancelModal
              header={`Cancel Loan #${pid}`}
              content={`You are about to cancel loan #${pid}.
                Please enter a reason for cancelling this loan.`}
              cancelText="Cancel Loan"
              buttonText="cancel"
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
    const { availableActions, pid } = this.props.loanDetails;
    const {
      document_pid,
      item_pid,
      patron_pid,
    } = this.props.loanDetails.metadata;
    if (availableActions) {
      return (
        <List horizontal>
          {Object.keys(availableActions).length ? (
            this.renderAvailableActions(
              pid,
              patron_pid,
              document_pid,
              item_pid,
              availableActions
            )
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
