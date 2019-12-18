import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';
import { RejectAction } from './';

export default class RequestActions extends Component {
  onReject = data => {
    this.props.rejectRequest(this.props.request.pid, data);
  };

  getAvailableActions() {
    const { request } = this.props;

    if (request.state === 'PENDING') {
      return [
        {
          name: 'Accept',
          value: (
            <Button
              primary
              disabled
              icon="check"
              labelPosition="left"
              content="Accept"
            />
          ),
        },
        {
          name: 'Reject',
          value: <RejectAction pid={request.pid} onReject={this.onReject} />,
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
  request: PropTypes.object.isRequired,
  rejectRequest: PropTypes.func.isRequired,
};
