import React, { Component } from 'react';
import {
  Grid,
  Segment,
  Container,
  Header,
  Button,
  Table,
  Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './ItemMetadata.scss';

export default class ItemMetadata extends Component {
  openEditor(url) {
    window.open(`/editor?url=${url}`, url);
  }

  render() {
    const data = this.props.itemDetails.metadata;
    const itemUrl = this.props.itemDetails.links.self;
    return (
      <Segment className="item-metadata">
        <Grid padded columns={2}>
          <Grid.Column width={16}>
            <Header as="h1">
              Item - {data.barcode}
              <Button
                primary
                floated="right"
                size="small"
                onClick={() => this.openEditor(itemUrl)}
              >
                <Icon name="edit" />
                edit
              </Button>
            </Header>
          </Grid.Column>

          <Grid.Column>
            <Table basic="very" definition className="metadata-table">
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Circulation Status</Table.Cell>
                  <Table.Cell width={12}>
                    {data.circulation_status.state}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Item Status</Table.Cell>
                  <Table.Cell width={12}>{data.status}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Barcode</Table.Cell>
                  <Table.Cell>{data.barcode}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Medium</Table.Cell>
                  <Table.Cell>{data.medium}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Circulation Restriction</Table.Cell>
                  <Table.Cell>{data.circulation_restriction}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Shelf</Table.Cell>
                  <Table.Cell>{data.shelf}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Legacy ID</Table.Cell>
                  <Table.Cell>{data.legacy_id}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Document</Table.Cell>
                  <Table.Cell>{data.document_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Library</Table.Cell>
                  <Table.Cell>
                    {data.internal_location.location.name}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Location</Table.Cell>
                  <Table.Cell>{data.internal_location.name}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column>
            <Container>
              <Header as="h3">Description</Header>
              <p>{data.description}</p>
            </Container>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

ItemMetadata.propTypes = {
  itemDetails: PropTypes.object.isRequired,
};
