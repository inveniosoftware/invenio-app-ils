import React, { Component } from 'react';
import { ErrorMessage, SuccessMessage, WarningMessage } from './messages';
import './Notifications.scss';

export default class Notifications extends Component {
  renderNotification(notification) {
    const { removeNotification } = this.props;

    let MessageComponent = ErrorMessage;
    if (notification.type === 'success') {
      MessageComponent = SuccessMessage;
    } else if (notification.type === 'warning') {
      MessageComponent = WarningMessage;
    }

    return (
      <MessageComponent
        id={notification.id}
        key={notification.id}
        header={notification.title}
        content={notification.content}
        removeNotification={removeNotification}
      />
    );
  }

  render() {
    const { notifications } = this.props;
    return (
      <div id="notifications">
        {notifications.map(message => this.renderNotification(message))}
      </div>
    );
  }
}
