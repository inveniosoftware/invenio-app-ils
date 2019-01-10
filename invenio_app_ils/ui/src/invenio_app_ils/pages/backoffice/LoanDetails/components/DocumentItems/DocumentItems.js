import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Header, Table, Icon, Button, Popup } from 'semantic-ui-react';
import { Loader, Error } from '../../../../../common/components';
import { toString } from '../../../../../common/api/date';
import './DocumentItems.scss';

export default class DocumentItems extends Component {
  constructor(props) {
    super(props);
    this.fetchDocumentItems = props.fetchDocumentItems;
    this.assignLoanItem = props.assignLoanItem;
    this.documentItemsChangeSortBy = props.documentItemsChangeSortBy;
    this.documentItemsChangeSortOrder = props.documentItemsChangeSortOrder;
  }

  componentDidMount() {
    const { document_pid } = this.props.loan.metadata;
    this.fetchDocumentItems(document_pid);
  }

  // _handleRowClick = loanPid => {
  //   const path = generatePath(BackOfficeURLS.loanDetails, { loanPid: loanPid });
  //   this.props.history.push(path);
  // };

  _getFormattedDate = d => (d ? toString(d) : '');

  // _handleShowAllClick = () => {
  //   const { document_pid, item_pid } = this.props.item.metadata;
  //   const qs = loanApi.buildPendingQuery(document_pid, item_pid);
  //   const url = `${BackOfficeURLS.loansSearch}?q=${qs}`;
  //   this.props.history.push(url);
  // };

  // _renderFooter = pendingLoans => {
  //   const total = pendingLoans.length;
  //   return total > this.props.showMaxDocumentItems ? (
  //     <Table.Footer fullWidth data-test="footer">
  //       <Table.Row>
  //         <Table.HeaderCell colSpan="5" textAlign="right">
  //           <span>
  //             Showing first {this.props.showMaxDocumentItems} pending requests
  //           </span>
  //           <Button size="small" onClick={this._handleShowAllClick}>
  //             Show all
  //           </Button>
  //         </Table.HeaderCell>
  //       </Table.Row>
  //     </Table.Footer>
  //   ) : null;
  // };

  _handleSortClick = sortByValue => {
    const { document_pid } = this.props.loan.metadata;
    if (this.props.currentSortBy === sortByValue) {
      this.documentItemsChangeSortOrder(document_pid);
    } else {
      this.documentItemsChangeSortBy(document_pid);
    }
  };

  _renderDocumentItems = documentItems => {
    const _documentItems = documentItems
      .slice(0, this.props.showMaxDocumentItems)
      .map(item => this._renderItem(item));
    return (
      <Table singleLine selectable className="document-items">
        <Table.Header>
          <Table.Row data-test="header">
            <Table.HeaderCell />
            <Table.HeaderCell>Barcode</Table.HeaderCell>
            <Table.HeaderCell>
              <span>Status</span>
              <Popup
                trigger={
                  <Icon
                    name="sort"
                    link
                    onClick={() => this._handleSortClick('status')}
                  />
                }
                content="Sort by status"
                size="mini"
                position="top center"
              />
            </Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        <Table.Body>{_documentItems}</Table.Body>
        {/* {this._renderFooter(documentItems)} */}
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
              this.assignLoanItem(this.props.loan.metadata.loan_pid, item.id);
            }}
          >
            assign
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  };

  _renderDocumentItemsOrEmpty = documentItems => {
    return documentItems.length ? (
      this._renderDocumentItems(documentItems)
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
          {this._renderDocumentItemsOrEmpty(data)}
        </Error>
      </Loader>
    );
  }
}

DocumentItems.propTypes = {
  // assignLoanItem: PropTypes.func.isRequired,
  currentSortBy: PropTypes.string.isRequired,
  currentSortOrder: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  documentItemsChangeSortBy: PropTypes.func.isRequired,
  documentItemsChangeSortOrder: PropTypes.func.isRequired,
  fetchDocumentItems: PropTypes.func.isRequired,
  showMaxDocumentItems: PropTypes.number,
};

DocumentItems.defaultProps = {
  showMaxDocumentItems: 5,
};
