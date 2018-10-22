import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';

import './ItemTitle.scss';

export class ItemTitle extends Component {
  render() {
    let { data } = this.props;
    return (
      <h1>
        Item details <small>{data.metadata.itemid}</small>
        <Button primary floated="right">
          <Icon name="edit" />
          &nbsp;edit
        </Button>
      </h1>
    );
  }
}
