import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const SendMailButton = props => {
  return (
    <Button
      {...props}
      size="small"
      icon
      color="purple"
      title="Send a reminder email to the user of the loan"
    >
      <Icon name="mail" />
    </Button>
  );
};

export default SendMailButton;
