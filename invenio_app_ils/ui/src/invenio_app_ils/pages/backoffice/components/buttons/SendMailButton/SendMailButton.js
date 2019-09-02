import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default class SendMailButton extends Component {
  render() {
    return (
      <Button
        size="small"
        icon
        color="purple"
        title="Send a reminder email to the user of the loan"
      >
        <Icon name="mail" />
      </Button>
    );
  }
}
