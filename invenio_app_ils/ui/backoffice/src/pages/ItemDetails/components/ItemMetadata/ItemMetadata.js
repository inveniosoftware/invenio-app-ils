import React, { Component } from 'react';
import { Grid, Segment, List, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './ItemMetadata.scss';

export class ItemMetadata extends Component {
  render() {
    let { metadata: data } = this.props.data;
    return (
      <Segment className="item-metadata">
        <Grid padded columns={2}>
          <Grid.Column width={16}>
            <Header as="h1">Item - {data.barcode}</Header>
          </Grid.Column>
          <Grid.Column>
            <List relaxed size="large">
              <List.Item>
                <List.Header>Status</List.Header>
                {data.status}
              </List.Item>
              <List.Item>
                <List.Header>Barcode</List.Header>
                {data.barcode}
              </List.Item>
              <List.Item>
                <List.Header>Library</List.Header>
                {data.internal_location_pid}
              </List.Item>
              <List.Item>
                <List.Header>Medium</List.Header>
                {data.medium}
              </List.Item>
              <List.Item>
                <List.Header>Circulation Restriction</List.Header>
                {data.circulation_restriction}
              </List.Item>
              <List.Item>
                <List.Header>Shelf</List.Header>
                {data.shelf}
              </List.Item>
              <List.Item>
                <List.Header>Legacy ID</List.Header>
                {data.legacy_id}
              </List.Item>
              <List.Item>
                <List.Header>Document</List.Header>
                {data.document_pid}
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <List.Header>Description</List.Header>
            {data.description}
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

ItemMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};
