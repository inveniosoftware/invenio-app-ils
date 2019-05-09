import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { SUCCESS_AUTO_DISMISS_SECONDS } from '../../../common/config';

export class IlsMessage extends Component {
  componentDidMount() {
    const { autoDismiss, onDismiss } = this.props;
    if (autoDismiss) {
      setTimeout(onDismiss, autoDismiss);
    }
  }

  render() {
    const { autoDismiss, ...props } = this.props;

    return <Message floating {...props} />;
  }
}

export const ErrorMessage = ({ id, header, content, removeNotification }) => (
  <IlsMessage
    negative
    icon="exclamation"
    header={header}
    content={content}
    onDismiss={() => removeNotification(id)}
  />
);

export const WarningMessage = ({ id, header, content, removeNotification }) => (
  <IlsMessage
    warning
    icon="exclamation triangle"
    header={header}
    content={content}
    onDismiss={() => removeNotification(id)}
  />
);

export const SuccessMessage = ({ id, header, content, removeNotification }) => (
  <IlsMessage
    success
    icon="check"
    header={header}
    content={content}
    autoDismiss={SUCCESS_AUTO_DISMISS_SECONDS * 1000}
    onDismiss={() => removeNotification(id)}
  />
);
