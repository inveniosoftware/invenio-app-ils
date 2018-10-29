import React, { Component } from 'react';
import { Icon, Button, Container } from 'semantic-ui-react';

import './ItemTitle.scss';

export class ItemTitle extends Component {
  render() {
    let { itemId } = this.props;
    return (
      <Container className="item-title">
        <h1>
          Item
          <small>
            &nbsp;
            {itemId}
            <Button primary floated="right" size="small">
              <Icon name="edit" />
              &nbsp;edit
            </Button>
          </small>
        </h1>
      </Container>
    );
  }
}
