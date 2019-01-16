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
      availableActions: actions,
      metadata: loan,
      id: pid,
    } = this.props.loanDetails;
    return (
      <List horizontal>
        {Object.keys(actions).length ? (
          this.renderAvailableActions(pid, loan, actions)
        ) : (
          <List.Header as="h3">No actions available</List.Header>
        )}
      </List>
    );
  }
}

LoanActions.propTypes = {
  loanDetails: PropTypes.object.isRequired,
  performLoanAction: PropTypes.func,
};
