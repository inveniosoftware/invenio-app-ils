import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Container, Header, Table } from 'semantic-ui-react';
import { CreateNewLoanModal } from './components/CreateNewLoanModal';
import { DeleteRecordModal } from '../../../components/DeleteRecordModal';
import { BackOfficeRoutes, openRecordEditor } from '../../../../../routes/urls';
import { loan as loanApi, item as itemApi } from '../../../../../common/api';
import { invenioConfig } from '../../../../../common/config';
import { EditButton } from '../../../components/buttons';

import './ItemMetadata.scss';

export default class ItemMetadata extends Component {
  constructor(props) {
    super(props);
    this.deleteItem = props.deleteItem;
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

  render() {
    const { item } = this.props;
    const header = (
      <Grid.Row>
        <Grid.Column width={10} verticalAlign={'middle'}>
          <Header as="h1">Item - {item.metadata.barcode}</Header>
        </Grid.Column>
        <Grid.Column width={6} textAlign={'right'}>
          <CreateNewLoanModal
            documentPid={`${item.metadata.document_pid}`}
            itemPid={`${item.item_pid}`}
            itemBarcode={`${item.metadata.barcode}`}
            active={
              !invenioConfig.circulation.loanActiveStates.includes(
                item.metadata.circulation_status.state
              ) &&
              invenioConfig.items.available.status.includes(
                item.metadata.status
              )
            }
            onLoanCreatedCallback={this.props.fetchItemDetails}
          />
          <EditButton
            clickHandler={() => openRecordEditor(itemApi.url, item.item_pid)}
          />
          <DeleteRecordModal
            deleteHeader={`Are you sure you want to delete the Item
            record with ID ${item.item_pid}?`}
            onDelete={() => this.deleteItem(item.item_pid)}
            refProps={this.createRefProps(item.item_pid)}
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
                    <Table.Cell>
                      {item.metadata.circulation_restriction}
                    </Table.Cell>
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
                      {item.metadata.internal_location.name}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Location</Table.Cell>
                    <Table.Cell>
                      {item.metadata.internal_location.location.name}
                    </Table.Cell>
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
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

ItemMetadata.propTypes = {
  item: PropTypes.object.isRequired,
};
