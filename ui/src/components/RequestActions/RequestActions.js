import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import { CancelModal } from '@components/CancelModal';

export default class RequestActions extends Component {
  onReject = reason => {
    this.props.rejectRequest(this.props.requestData.metadata.requestPid, {
      reason,
    });
  };

  getAvailableActions() {
    const { requestPid, requestState } = this.props;

    if (requestState === 'PENDING') {
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
              header={this.props.renderRequestCancelHeader(requestPid)}
              content={this.props.renderRequestCancelContent(requestPid)}
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
  requestPid: PropTypes.string.isRequired,
  requestState: PropTypes.string.isRequired,
  renderRequestCancelHeader: PropTypes.func.isRequired,
  renderRequestCancelContent: PropTypes.func.isRequired,
  rejectRequest: PropTypes.func.isRequired,
};
