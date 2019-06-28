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
import { BackOfficeRoutes, openRecordEditor } from '../../../../../routes/urls';
import {
  loan as loanApi,
  item as itemApi,
  document as documentApi,
  patron as patronApi,
} from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { EditButton } from '../../../components/buttons';

import './ItemMetadata.scss';
import { ESSelectorModal } from '../../../../../common/components/ESSelector';
import { serializeDocument } from '../../../../../common/components/ESSelector/serializer';

export default class ItemMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteItem = props.deleteItem;
    this.itemPid = this.props.itemDetails.metadata.item_pid;
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
          this.props.itemDetails.metadata.circulation_status.state
        ) ||
        !invenioConfig.items.available.status.includes(
          this.props.itemDetails.metadata.status
        )
      }
    />
  );

  requestLoan = results => {
    const loanData = {
      metadata: {
        document_pid: this.props.itemDetails.metadata.document_pid,
        item_pid: this.props.itemDetails.metadata.item_pid,
        patron_pid: results[0].metadata.id.toString(),
      },
    };
    this.props.createNewLoanForItem(loanData);
  };

  updateDocument = results => {
    const newDocumentPid = results[0].metadata.document_pid;
    this.props.updateItem(this.itemPid, '/document_pid', newDocumentPid);
  };

  render() {
    const { itemDetails } = this.props;
    const selectedDocument = new Array(
      serializeDocument(itemDetails.metadata.document)
    );
    const header = (
      <Grid.Row>
        <Grid.Column width={10} verticalAlign={'middle'}>
          <Header as="h1">Item - {itemDetails.metadata.barcode}</Header>
        </Grid.Column>
        <Grid.Column width={6} textAlign={'right'}>
          <ESSelectorModal
            trigger={this.checkoutItemButton}
            query={patronApi.list}
            title={`You are about to checkout the item with
                    barcode ${itemDetails.metadata.barcode}.`}
            content={
              'Search for the patron to whom the loan should be assigned:'
            }
            selectionInfoText={
              'The loan will be assigned to the following patron:'
            }
            emptySelectionInfoText={'No patron selected yet'}
            onSave={this.requestLoan}
            saveButtonContent={'Checkout item'}
          />

          <EditButton
            clickHandler={() =>
              openRecordEditor(itemApi.url, itemDetails.item_pid)
            }
          />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Item
            record with ID ${itemDetails.item_pid}?`}
            onDelete={() => this.deleteItem(itemDetails.item_pid)}
            refProps={this.createRefProps(itemDetails.item_pid)}
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
                      {itemDetails.metadata.circulation_status.state}
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
                        <List.Item>
                          <ESSelectorModal
                            initialSelections={selectedDocument}
                            trigger={
                              <Button
                                basic
                                color="blue"
                                size="small"
                                content="edit"
                              />
                            }
                            minCharacters={1}
                            query={documentApi.list}
                            title="Select Document"
                            onSave={this.updateDocument}
                          />
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
