import React, { Component } from 'react';
import { Segment, Message } from 'semantic-ui-react';

export class ItemLoanHistory extends Component {
  render() {
    return (
      <Segment raised>
        <Message info>
          <Message.Header>This item has never been loaned!</Message.Header>
        </Message>
      </Segment>
    );
  }
}
