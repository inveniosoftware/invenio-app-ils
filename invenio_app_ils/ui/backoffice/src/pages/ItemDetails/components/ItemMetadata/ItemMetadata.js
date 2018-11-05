import React, { Component } from 'react';
import { Grid, Segment, Form } from 'semantic-ui-react';

import './ItemMetadata.scss';

export class ItemMetadata extends Component {
  renderItemMetadata(data) {
    return Object.keys(data.metadata).map(key => {
      if (typeof data.metadata[key] !== 'object') {
        return (
          <Form.Field key={key}>
            <label className="field-name">{key}</label>
            <p>{data.metadata[key]}</p>
          </Form.Field>
        );
      }
      return '';
    });
  }

  render() {
    let { data } = this.props;
    return (
      <Segment className="item-metadata">
        <Grid>
          <Grid.Column>
            <h1>Item - {data.id}</h1>
            <Form>{this.renderItemMetadata(data)}</Form>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}
