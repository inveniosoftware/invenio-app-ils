import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Table } from 'semantic-ui-react';

export default class LoanMetadata extends Component {
  render() {
    const data = this.props.loanDetails.metadata;
    return (
      <Segment>
        <Grid padded columns={2}>
          <Grid.Column width={16}>
            <Header as="h1">Loan - {data.loan_pid}</Header>
          </Grid.Column>

          <Grid.Column>
            <Table basic="very" definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Item pid</Table.Cell>
                  <Table.Cell width={12}>{data.item_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Patron pid</Table.Cell>
                  <Table.Cell width={12}>{data.patron_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Pickup location pid</Table.Cell>
                  <Table.Cell width={12}>{data.pickup_location_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Transaction Location pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.transaction_location_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Transaction User pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.transaction_user_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>State</Table.Cell>
                  <Table.Cell width={12}>{data.state}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column>
            <Table basic="very" definition>
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={3}>Transaction date</Table.Cell>
                  <Table.Cell width={12}>{data.transaction_date}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={3}>Expire Date</Table.Cell>
                  <Table.Cell width={12}>{data.request_expire_date}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

LoanMetadata.propTypes = {
  loanDetails: PropTypes.object.isRequired,
};
