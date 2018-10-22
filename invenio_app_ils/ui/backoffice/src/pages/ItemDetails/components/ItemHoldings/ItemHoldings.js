import React, { Component } from 'react';
import { Segment, Message } from 'semantic-ui-react';

export class ItemHoldings extends Component {
  render() {
    return (
      <Segment raised>
        <Message info>
          <Message.Header>There are no holdings for this item!</Message.Header>
        </Message>
      </Segment>
    );
  }
}
