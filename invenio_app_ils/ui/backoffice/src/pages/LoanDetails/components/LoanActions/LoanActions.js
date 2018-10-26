import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Loader } from 'semantic-ui-react';

export class LoanActions extends Component {
  constructor(props) {
    super(props);
    this.handleActionsOnClick = this.handleActionsOnClick.bind(this);
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
    let { actions, data, actionLoading } = this.props;
    if (actionLoading) return <Loader active inline="centered" />;
    return <List horizontal>{this.renderAvailableActions(actions, data)}</List>;
  }
}

LoanActions.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
  actionLoading: PropTypes.bool,
};
