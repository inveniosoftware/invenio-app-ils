import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Loader } from 'semantic-ui-react';
import './LoanActions.scss';

class LoanActions extends Component {
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
        <List.Item key={action} className="item-inline">
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
    return <List.Item>{this.renderAvailableActions(actions, data)}</List.Item>;
  }
}

export default LoanActions;

LoanActions.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object,
  onAction: PropTypes.func.isRequired,
  actionLoading: PropTypes.bool,
};
