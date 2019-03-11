import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Table, Divider } from 'semantic-ui-react';
import { ItemMetadata } from '../ItemMetadata';
import { LoanActions } from '../LoanActions';
import { AvailableItems } from '../AvailableItems';
import _isEmpty from 'lodash/isEmpty';
import { toShortDateTime } from '../../../../../common/api/date';

export default class LoanMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAvailableItemsVisible: _isEmpty(this.props.loanDetails.item),
    };
  }

  showAvailableItems = (newState = true) => {
    this.setState({ isAvailableItemsVisible: newState });
  };

  render() {
    const data = this.props.loanDetails;
    return (
      <Segment>
        <Grid padded columns={2}>
          <Grid.Column width={16}>
            <Header as="h1">Loan - {data.loan_pid}</Header>
          </Grid.Column>

          <Grid.Column>
            <Table basic="very">
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={4}>Document pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.metadata.document_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Item pid</Table.Cell>
                  <Table.Cell width={12}>{data.metadata.item_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Patron pid</Table.Cell>
                  <Table.Cell width={12}>{data.metadata.patron_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Pickup Location pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.metadata.pickup_location_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Transaction Location pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.metadata.transaction_location_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Transaction User pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.metadata.transaction_user_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>State</Table.Cell>
                  <Table.Cell width={12}>{data.metadata.state}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column>
            <Table basic="very">
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={4}>Transaction date</Table.Cell>
                  <Table.Cell width={12}>
                    {toShortDateTime(data.metadata.transaction_date)}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Expire Date</Table.Cell>
                  <Table.Cell width={12}>
                    {toShortDateTime(data.metadata.request_expire_date)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
        <Divider />
        <LoanActions />
        <Divider />
        {data.metadata.item && (
          <ItemMetadata
            item={data.metadata.item}
            loanState={data.metadata.state}
            changeItemClickHandler={this.showAvailableItems}
          />
        )}
        {this.state.isAvailableItemsVisible && data.metadata.item && (
          <Divider />
        )}
        {this.state.isAvailableItemsVisible && (
          <AvailableItems loan={this.props.loanDetails} />
        )}
      </Segment>
    );
  }
}

LoanMetadata.propTypes = {
  loanDetails: PropTypes.object.isRequired,
};
