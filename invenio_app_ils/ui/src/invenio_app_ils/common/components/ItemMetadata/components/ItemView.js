import React from 'react';
import {
  Grid,
  Segment,
  Container,
  Header,
  Button,
  Table,
  Icon,
} from 'semantic-ui-react';

export function ItemView(props) {
  const { item } = props;
  return (
    <Segment className="item-metadata">
      <Grid padded columns={2}>
        <Grid.Column width={16}>
          <Header as="h1">
            Item - {item.metadata.barcode}
            <Button
              primary
              floated="right"
              size="small"
              onClick={() =>
                window.open(`/editor?url=${item.links.self}`, item.links.self)
              }
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
                <Table.Cell width={4}>Circulation Status</Table.Cell>
                <Table.Cell width={12}>
                  {item.metadata.circulation_status.state}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width={4}>Item Status</Table.Cell>
                <Table.Cell width={12}>{item.metadata.status}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Barcode</Table.Cell>
                <Table.Cell>{item.metadata.barcode}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Medium</Table.Cell>
                <Table.Cell>{item.metadata.medium}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Circulation Restriction</Table.Cell>
                <Table.Cell>{item.metadata.circulation_restriction}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Shelf</Table.Cell>
                <Table.Cell>{item.metadata.shelf}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Legacy ID</Table.Cell>
                <Table.Cell>{item.metadata.legacy_id}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Document</Table.Cell>
                <Table.Cell>{item.metadata.document_pid}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Library</Table.Cell>
                <Table.Cell>
                  {item.metadata.internal_location.location.name}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Location</Table.Cell>
                <Table.Cell>{item.metadata.internal_location.name}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Grid.Column>

        <Grid.Column>
          <Container>
            <Header as="h4">Description</Header>
            <p>{item.metadata.description}</p>
          </Container>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
