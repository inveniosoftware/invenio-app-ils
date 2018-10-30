import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button } from 'semantic-ui-react';

export class LoanActions extends Component {
  constructor(props) {
    super(props);
    this.onAction = this.props.onAction;
  }

  handleActionsOnClick(url, data) {
    return () => {
      this.onAction(url, data);
    };
  }

  renderAvailableActions(actions = {}, data) {
    return Object.keys(actions).map(action => {
      return (
        <List.Item key={action}>
          <Button
            primary
            onClick={this.handleActionsOnClick(actions[action], data)}
          >
            {action}
          </Button>
        </List.Item>
      );
    });
  }

  render() {
    let { availableActions: actions, metadata: data } = this.props.data;
    return <List horizontal>{this.renderAvailableActions(actions, data)}</List>;
  }
}

LoanActions.propTypes = {
  data: PropTypes.object.isRequired,
  onAction: PropTypes.func,
  actionLoading: PropTypes.bool,
};
