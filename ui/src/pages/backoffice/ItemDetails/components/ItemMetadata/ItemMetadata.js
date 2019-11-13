import React from 'react';
import { Component } from 'react';
import {
  Grid,
  Segment,
  Container,
  Header,
  Table,
  Button,
  List,
} from 'semantic-ui-react';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';
import { BackOfficeRoutes } from '../../../../../routes/urls';
import {
  loan as loanApi,
  patron as patronApi,
} from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { EditButton } from '../../../components/buttons';
import { ESSelectorModal } from '../../../../../common/components/ESSelector';
import { serializePatron } from '../../../../../common/components/ESSelector/serializer';

export default class ItemMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteItem = props.deleteItem;
    this.itemPid = this.props.itemDetails.metadata.pid;
  }

  handleOnRefClick(loanPid) {
    const navUrl = BackOfficeRoutes.loanDetailsFor(loanPid);
    window.open(navUrl, `_loan_${loanPid}`);
  }

  createRefProps(itemPid) {
    return [
      {
        refType: 'Loan',
        onRefClick: this.handleOnRefClick,
        getRefData: () =>
          loanApi.list(
            loanApi
              .query()
              .withItemPid(itemPid)
              .withState(invenioConfig.circulation.loanActiveStates)
              .qs()
          ),
      },
    ];
  }

  checkoutItemButton = (
    <Button
      positive
      icon="add"
      labelPosition="left"
      size="small"
      content="Checkout this item"
      onClick={() => this.setState({ open: true })}
      disabled={
        invenioConfig.circulation.loanActiveStates.includes(
          this.props.itemDetails.metadata.circulation.state
        ) ||
        !invenioConfig.items.canCirculateStates.includes(
          this.props.itemDetails.metadata.status
        )
      }
    />
  );

  checkoutItem = results => {
    const documentPid = this.props.itemDetails.metadata.document_pid;
    const itemPid = this.props.itemDetails.metadata.pid;
    const patronPid = results[0].metadata.id.toString();
    this.props.checkoutItem(documentPid, itemPid, patronPid);
  };

  render() {
    const { itemDetails } = this.props;
    const header = (
      <Grid.Row>
        <Grid.Column width={10} verticalAlign={'middle'}>
          <Header as="h1">Item - {itemDetails.metadata.barcode}</Header>
        </Grid.Column>
        <Grid.Column width={6} textAlign={'right'}>
          <ESSelectorModal
            trigger={this.checkoutItemButton}
            query={patronApi.list}
            serializer={serializePatron}
            title={`You are about to checkout the item with
                    barcode ${itemDetails.metadata.barcode}.`}
            content={
              'Search for the patron to whom the loan should be created:'
            }
            selectionInfoText={
              'The loan will be created for the following patron:'
            }
            emptySelectionInfoText={'No patron selected yet'}
            onSave={this.checkoutItem}
            saveButtonContent={'Checkout item'}
          />

          <EditButton to={BackOfficeRoutes.itemEditFor(this.itemPid)} />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Item
            record with ID ${itemDetails.pid}?`}
            onDelete={() => this.deleteItem(itemDetails.pid)}
            refProps={this.createRefProps(itemDetails.pid)}
          />
        </Grid.Column>
      </Grid.Row>
    );

    return (
      <Segment className="item-metadata">
        <Grid padded columns={2}>
          {header}
          <Grid.Row>
            <Grid.Column>
              <Table basic="very" definition className="metadata-table">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell width={4}>Circulation Status</Table.Cell>
                    <Table.Cell width={12}>
                      {itemDetails.metadata.circulation.state}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell width={4}>Item Status</Table.Cell>
                    <Table.Cell width={12}>
                      {itemDetails.metadata.status}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Barcode</Table.Cell>
                    <Table.Cell>{itemDetails.metadata.barcode}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Medium</Table.Cell>
                    <Table.Cell>{itemDetails.metadata.medium}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Circulation Restriction</Table.Cell>
                    <Table.Cell>
                      {itemDetails.metadata.circulation_restriction}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Shelf</Table.Cell>
                    <Table.Cell>{itemDetails.metadata.shelf}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Legacy ID</Table.Cell>
                    <Table.Cell>{itemDetails.metadata.legacy_id}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Document</Table.Cell>
                    <Table.Cell>
                      <List horizontal>
                        <List.Item>
                          {itemDetails.metadata.document_pid}
                        </List.Item>
                      </List>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Library</Table.Cell>
                    <Table.Cell>
                      {itemDetails.metadata.internal_location.name}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Location</Table.Cell>
                    <Table.Cell>
                      {itemDetails.metadata.internal_location.location.name}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>

            <Grid.Column>
              <Container>
                <Header as="h4">Description</Header>
                <p>{itemDetails.metadata.description}</p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}
