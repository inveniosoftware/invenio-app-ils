import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import { omit } from 'lodash/object';
import { CancelModal } from '../../../../../common/components/CancelModal';

export default class RequestActions extends Component {
  onCancel = reason => {
    this.props.performCancelAction(
      this.props.documentRequestDetails.metadata.pid,
      reason
    );
  };

  getAvailableActions() {
    const { pid, state } = this.props.documentRequestDetails.metadata;
    const actions = [];

    if (state == 'PENDING') {
      return [
        {
          name: 'Fulfill',
          value: (
            <Button primary disabled>
              Fulfill
            </Button>
          ),
        },
        {
          name: 'Cancel',
          value: (
            <CancelModal
              header={`Cancel Document Request #${pid}`}
              content={`You are about to cancel document request #${pid}.
                Please enter a reason for cancelling this request.`}
              buttonText="Cancel"
              cancelText="Cancel Request"
              action={this.onCancel}
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
