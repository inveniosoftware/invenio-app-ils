import {
  InfoMessage,
  OverdueLoanSendMailModal,
} from '@pages/backoffice/components';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Grid } from 'semantic-ui-react';
import { omit } from 'lodash/object';
import { CancelModal } from '@components/CancelModal';
import _isEmpty from 'lodash/isEmpty';

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

    const loanActions = !_isEmpty(availableActions) && (
      <List horizontal>
        {this.renderAvailableActions(
          pid,
          patron_pid,
          document_pid,
          item_pid,
          availableActions
        )}
      </List>
    );
    const sendReminderButton = this.props.loanDetails.metadata.is_overdue && (
      <OverdueLoanSendMailModal
        loan={this.props.loanDetails}
        buttonTriggerText="Send return reminder"
      />
    );
    if (
      !_isEmpty(availableActions) ||
      this.props.loanDetails.metadata.is_overdue
    ) {
      return (
        <Grid columns={2}>
          <Grid.Column width={12}>{loanActions}</Grid.Column>
          <Grid.Column width={4} textAlign="right">
            {sendReminderButton}
          </Grid.Column>
        </Grid>
      );
    } else {
      return (
        <InfoMessage
          fluid
          header={'No actions available.'}
          content={"The loan can't be changed in it's current state."}
        />
      );
    }
  }
}

LoanActions.propTypes = {
  loanDetails: PropTypes.object.isRequired,
  performLoanAction: PropTypes.func,
};
