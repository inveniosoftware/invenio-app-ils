import React from 'react';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Table,
} from 'semantic-ui-react';

export function LoanView(props) {
  const { item } = props;
  return (
    <Grid className="item-metadata" padded columns={2}>
      <Grid.Column width={16}>
        <Header as="h1">
          Item - {item.barcode}
          <Button
            primary
            floated="right"
            size="small"
            onClick={() => props.handlerShowItemList(true)}
          >
            <Icon name="exchange" />
            change item
          </Button>
        </Header>
      </Grid.Column>

      <Grid.Column>
        <Table basic="very" definition className="metadata-table">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={4}>Item Status</Table.Cell>
              <Table.Cell width={12}>{item.status}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Barcode</Table.Cell>
              <Table.Cell>{item.barcode}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Medium</Table.Cell>
              <Table.Cell>{item.medium}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Circulation Restriction</Table.Cell>
              <Table.Cell>{item.circulation_restriction}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Shelf</Table.Cell>
              <Table.Cell>{item.shelf}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Legacy ID</Table.Cell>
              <Table.Cell>{item.legacy_id}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Document</Table.Cell>
              <Table.Cell>{item.document_pid}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Grid.Column>

      <Grid.Column>
        <Container>
          <Header as="h4">Description</Header>
          <p>{item.description}</p>
        </Container>
      </Grid.Column>
    </Grid>
  );
}
