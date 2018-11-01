import React, { Component } from 'react';
import { Segment, Message } from 'semantic-ui-react';

export class ItemLoans extends Component {
  render() {
    return (
      <Segment>
        <Message info>
          <Message.Header>There are no loans for this item!</Message.Header>
        </Message>
      </Segment>
    );
  }
}
