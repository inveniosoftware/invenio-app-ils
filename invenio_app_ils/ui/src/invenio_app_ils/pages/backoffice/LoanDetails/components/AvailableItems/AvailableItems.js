import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Header, Table, Button } from 'semantic-ui-react';
import { Loader, Error } from '../../../../../common/components';
import './AvailableItems.scss';

export default class AvailableItems extends Component {
  constructor(props) {
    super(props);
    this.fetchAvailableItems = props.fetchAvailableItems;
    this.assignItemToLoan = props.assignItemToLoan;
  }

  componentDidMount() {
    const { document_pid } = this.props.loan.metadata;
    this.fetchAvailableItems(document_pid);
  }

  _renderAvailableItems = availableItems => {
    const _availableItems = availableItems
      .slice(0, this.props.showMaxAvailableItems)
      .map(item => this._renderItem(item));
    return (
      <Table singleLine selectable className="document-items">
        <Table.Header>
          <Table.Row data-test="header">
            <Table.HeaderCell />
            <Table.HeaderCell>Barcode</Table.HeaderCell>
            <Table.HeaderCell>
              <span>Status</span>
            </Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>{_availableItems}</Table.Body>
      </Table>
    );
  };

  _renderItem = item => {
    return (
      <Table.Row key={item.id}>
        <Table.Cell />
        <Table.Cell>{item.metadata.barcode}</Table.Cell>
        <Table.Cell>{item.metadata.status}</Table.Cell>
        <Table.Cell>{item.metadata.internal_location.name}</Table.Cell>
        <Table.Cell textAlign="right">
          <Button
            size="mini"
            color="teal"
            onClick={() => {
              this.assignItemToLoan(item.id, this.props.loan.metadata.loan_pid);
            }}
          >
            assign
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  };

  _renderAvailableItemsOrEmpty = availableItems => {
    return availableItems.length ? (
      this._renderAvailableItems(availableItems)
    ) : (
      <Message data-test="no-results">
        There are no available items for this document
      </Message>
    );
  };

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <Header as="h3">Available items</Header>
          {this._renderAvailableItemsOrEmpty(data)}
        </Error>
      </Loader>
    );
  }
}

AvailableItems.propTypes = {
  assignItemToLoan: PropTypes.func.isRequired,
  currentSortBy: PropTypes.string.isRequired,
  currentSortOrder: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  fetchAvailableItems: PropTypes.func.isRequired,
  showMaxAvailableItems: PropTypes.number,
};

AvailableItems.defaultProps = {
  showMaxAvailableItems: 10,
};
