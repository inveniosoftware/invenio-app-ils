import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import { CancelModal } from '../../../../../common/components/CancelModal';

export default class RequestActions extends Component {
  onReject = reason => {
    this.props.performAction(
      this.props.documentRequestDetails.metadata.pid,
      'reject',
      { reason }
    );
  };

  getAvailableActions() {
    const { pid, state } = this.props.documentRequestDetails.metadata;

    if (state === 'PENDING') {
      return [
        {
          name: 'Accept',
          value: (
            <Button primary disabled>
              Accept
            </Button>
          ),
        },
        {
          name: 'Reject',
          value: (
            <CancelModal
              header={`Reject Document Request #${pid}`}
              content={`You are about to reject document request #${pid}.
                Please enter a reason for rejecting this request.`}
              buttonText="Reject"
              cancelText="Reject Request"
              action={this.onReject}
            />
          ),
        },
      ];
    } else {
      return [];
    }
  }

  renderAvailableActions(actions) {
    if (actions.length) {
      return actions.map(action => (
        <List.Item key={action.name}>{action.value}</List.Item>
      ));
    } else {
      return <List.Header as="h3">No actions available</List.Header>;
    }
  }

  render() {
    const actions = this.getAvailableActions();
    return <List horizontal>{this.renderAvailableActions(actions)}</List>;
  }
}

RequestActions.propTypes = {
  documentRequestDetails: PropTypes.object.isRequired,
};
