import React, { Component } from 'react';
import { Icon, Button } from 'semantic-ui-react';

import './ItemTitle.scss';

export class ItemTitle extends Component {
  render() {
    let { data } = this.props;
    console.log(data);
    return (
      <h1>
        Item details
        <small>
          {data.metadata.item_pid}
          <Button primary floated="right" size="small">
            <Icon name="edit" />
            &nbsp;edit
          </Button>
        </small>
      </h1>
    );
  }
}
