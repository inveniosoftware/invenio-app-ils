import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Table, Divider } from 'semantic-ui-react';
import { ItemMetadata } from '../../../../../common/components/ItemMetadata';
import { ItemsSearch } from '../../../ItemsSearch';
import { LoanActions } from '../LoanActions';
import _isEmpty from 'lodash/isEmpty';

export default class LoanMetadata extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showItemList: _isEmpty(this.props.loanDetails.metadata.item),
    };
  }

  handlerShowItemList = newState => {
    this.setState({ showItemList: newState });
  };

  render() {
    const data = this.props.loanDetails.metadata;
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
                  <Table.Cell width={4}>Item pid</Table.Cell>
                  <Table.Cell width={12}>{data.item_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Patron pid</Table.Cell>
                  <Table.Cell width={12}>{data.patron_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Pickup Location pid</Table.Cell>
                  <Table.Cell width={12}>{data.pickup_location_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Transaction Location pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.transaction_location_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Transaction User pid</Table.Cell>
                  <Table.Cell width={12}>
                    {data.transaction_user_pid}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>State</Table.Cell>
                  <Table.Cell width={12}>{data.state}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column>
            <Table basic="very">
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={4}>Transaction date</Table.Cell>
                  <Table.Cell width={12}>{data.transaction_date}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Expire Date</Table.Cell>
                  <Table.Cell width={12}>{data.request_expire_date}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
        <Divider />
        <LoanActions />
        <Divider />
        {data.item && (
          <ItemMetadata
            item={data.item}
            handlerShowItemList={this.handlerShowItemList}
            view="loan"
          />
        )}
        {this.state.showItemList && <Divider />}
        {this.state.showItemList && <ItemsSearch view="loan" />}
      </Segment>
    );
  }
}

LoanMetadata.propTypes = {
  loanDetails: PropTypes.object.isRequired,
};
