import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router';
import {
  Segment,
  Message,
  Header,
  Table,
  Icon,
  Button,
  Popup,
} from 'semantic-ui-react';
import { Loader, Error } from '../../../../../common/components';
import { BackOfficeURLS } from '../../../../../common/urls';
import { toString } from '../../../../../common/api/date';
import { loan as loanApi } from '../../../../../common/api/';
import './ItemPendingLoans.scss';

export default class ItemPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
    this.pendingLoansChangeSortBy = props.pendingLoansChangeSortBy;
    this.pendingLoansChangeSortOrder = props.pendingLoansChangeSortOrder;
  }

  componentDidMount() {
    const { document_pid, item_pid } = this.props.item.metadata;
    this.fetchPendingLoans(document_pid, item_pid);
  }

  _handleRowClick = loanPid => {
    const path = generatePath(BackOfficeURLS.loanDetails, { loanPid: loanPid });
    this.props.history.push(path);
  };

  _getFormattedDate = d => (d ? toString(d) : '');

  _renderPendingLoan = pendingLoan => {
    const updated = this._getFormattedDate(pendingLoan.updated);
    const startDate = this._getFormattedDate(pendingLoan.start_date);
    const endDate = this._getFormattedDate(pendingLoan.end_date);
    const periodOfInterest =
      startDate && endDate
        ? `${startDate} - ${endDate}`
        : `${startDate}${endDate}`;
    return (
      <Table.Row key={pendingLoan.loan_pid} data-test={pendingLoan.loan_pid}>
        <Table.Cell textAlign="center" collapsing>
          <Icon
            circular
            name="eye"
            link
            onClick={() => {
              this._handleRowClick(pendingLoan.loan_pid);
            }}
          />
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {pendingLoan.loan_pid}
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {pendingLoan.patron_pid}
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {updated}
        </Table.Cell>
        <Table.Cell>{periodOfInterest}</Table.Cell>
      </Table.Row>
    );
  };

  _handleShowAllClick = () => {
    const { document_pid, item_pid } = this.props.item.metadata;
    const qs = loanApi.buildLoansQuery(document_pid, item_pid, null, null);
    const url = `${BackOfficeURLS.loansSearch}?q=${qs}`;
    this.props.history.push(url);
  };

  _renderFooter = pendingLoans => {
    const total = pendingLoans.length;
    return total > this.props.showMaxPendingLoans ? (
      <Table.Footer fullWidth data-test="footer">
        <Table.Row>
          <Table.HeaderCell colSpan="5" textAlign="right">
            <span>
              Showing first {this.props.showMaxPendingLoans} pending requests
            </span>
            <Button size="small" onClick={this._handleShowAllClick}>
              Show all
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    ) : null;
  };

  _handleSortClick = sortByValue => {
    const { document_pid, item_pid } = this.props.item.metadata;
    if (this.props.currentSortBy === sortByValue) {
      // change sort order
      this.pendingLoansChangeSortOrder(document_pid, item_pid);
    } else {
      // change sort by
      this.pendingLoansChangeSortBy(document_pid, item_pid);
    }
  };

  _renderPendingLoans = pendingLoans => {
    const _pendingLoans = pendingLoans
      .slice(0, this.props.showMaxPendingLoans)
      .map(loan => this._renderPendingLoan(loan));
    return (
      <Table singleLine selectable className="item-pending-loans">
        <Table.Header>
          <Table.Row data-test="header">
            <Table.HeaderCell />
            <Table.HeaderCell textAlign="center">Loan</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Patron</Table.HeaderCell>
            <Table.HeaderCell>
              <span>Request created</span>
              <Popup
                trigger={
                  <Icon
                    name="sort"
                    link
                    onClick={() => this._handleSortClick('transaction_date')}
                  />
                }
                content="Sort by request date asc/desc"
                size="mini"
                position="top center"
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <span>Period of interest</span>
              <Popup
                trigger={
                  <Icon
                    name="sort"
                    link
                    onClick={() => this._handleSortClick('start_date')}
                  />
                }
                content="Sort by period of interest asc/desc"
                size="mini"
                position="top center"
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{_pendingLoans}</Table.Body>
        {this._renderFooter(pendingLoans)}
      </Table>
    );
  };

  _renderPendingLoansOrEmpty = pendingLoans => {
    return pendingLoans.length ? (
      this._renderPendingLoans(pendingLoans)
    ) : (
      <Message data-test="no-results">
        There are no pending loan requests for this item
      </Message>
    );
  };

  render() {
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <Segment>
            <Header as="h3">Pending loan requests</Header>
            {this._renderPendingLoansOrEmpty(data)}
          </Segment>
        </Error>
      </Loader>
    );
  }
}

ItemPendingLoans.propTypes = {
  item: PropTypes.object.isRequired,
  fetchPendingLoans: PropTypes.func.isRequired,
  pendingLoansChangeSortBy: PropTypes.func.isRequired,
  pendingLoansChangeSortOrder: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  currentSortBy: PropTypes.string.isRequired,
  currentSortOrder: PropTypes.string.isRequired,
  showMaxPendingLoans: PropTypes.number,
};

ItemPendingLoans.defaultProps = {
  showMaxPendingLoans: 5,
};
