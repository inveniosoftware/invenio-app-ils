import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { Segment, Header, Table, Message, Icon } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

export default class CheckoutSummary extends Component {
  _renderSuccess = loans => {
    let successList = [];
    for (let i = 0; i < loans.length; i++) {
      successList.push(
        <Table.Row positive key={loans[i].metadata.loan_pid}>
          <Table.Cell>{i + 1}</Table.Cell>
          <Table.Cell>
            <Icon name="checkmark" />
            {loans[i].metadata.item_barcode}
          </Table.Cell>
          <Table.Cell textAlign={'right'}>
            {loans[i].metadata.loan_pid}
          </Table.Cell>
        </Table.Row>
      );
    }
    return successList;
  };

  _renderFailed = errors => {
    let failedList = [];
    for (let i = 0; i < errors.length; i++) {
      failedList.push(
        <Table.Row error key={errors[i].item_barcode}>
          <Table.Cell>{i + 1}</Table.Cell>
          <Table.Cell textAlign={'right'}>
            {' '}
            <Icon name="attention" />
            {errors[i].item_barcode}
          </Table.Cell>
          <Table.Cell>{errors[i].error_msg}</Table.Cell>
        </Table.Row>
      );
    }
    return failedList;
  };

  _renderEmpty = () => {
    return <Message color="blue">No summary provided. Error.</Message>;
  };

  _renderSummary = data => {
    return (
      <Table striped size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={3} />
            <Table.HeaderCell>Barcode</Table.HeaderCell>
            <Table.HeaderCell>Loan ID/Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this._renderSuccess(data.loans)}
          {this._renderFailed(data.errors)}
        </Table.Body>
      </Table>
    );
  };

  render() {
    const { isLoading, hasError, data } = this.props;

    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          {_isEmpty(data) ? null : (
            <Segment>
              <Header as="h3" attached="top">
                Checkout summary
              </Header>
              {this._renderSummary(data)}
            </Segment>
          )}
        </Error>
      </Loader>
    );
  }
}

CheckoutSummary.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  hasError: PropTypes.bool.isRequired,
};
