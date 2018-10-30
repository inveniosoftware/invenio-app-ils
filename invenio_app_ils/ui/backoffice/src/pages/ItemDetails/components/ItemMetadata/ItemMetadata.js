import React, { Component } from 'react';
import { compose } from 'redux';
import { withError, withLoader } from 'common/components';
import { Grid, Segment, Form } from 'semantic-ui-react';

import './ItemMetadata.scss';

class ItemMetadataTemplate extends Component {
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
      <Segment raised className="item-metadata">
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

export const ItemMetadata = compose(
  withLoader,
  withError
)(ItemMetadataTemplate);
