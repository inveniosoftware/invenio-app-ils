import React, { Component } from 'react';
import { Icon, Button, Container } from 'semantic-ui-react';

import './ItemTitle.scss';

export class ItemTitle extends Component {
  render() {
    let { data } = this.props;
    return (
      <Container>
        <h1>
          Item
          <small>
            &nbsp;
            {data.metadata.item_pid}
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
