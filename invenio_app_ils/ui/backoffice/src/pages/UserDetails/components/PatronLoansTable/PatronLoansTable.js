import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Segment,
  Message,
  Header,
  Table,
  Icon,
  Button,
  Popup,
} from 'semantic-ui-react';
import { Loader, Error } from 'common/components';
import { URLS } from 'common/urls';
import { toString } from 'common/api/date';
import { loan as loanApi } from 'common/api/loan';
import './PatronLoansTable.scss';

export default class PatronLoansTable extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronLoans = props.fetchPatronLoans;
    this.patronLoansChangeSortBy = props.patronLoansChangeSortBy;
    this.patronLoansChangeSortOrder = props.patronLoansChangeSortOrder;
  }

  componentDidMount() {
    const initProps = {
      document_pid: null,
      item_pid: null,
    };
    this.initProps = initProps;
    const { document_pid, item_pid } = this.props.item
      ? this.props.item.metadata
      : initProps;
    const patron_pid = this.props.patron ? this.props.patron : null;
    const loan_state = this.props.loanState ? this.props.loanState : null;

    this.fetchPatronLoans(document_pid, item_pid, loan_state, patron_pid);
  }

  _handleRowClick = loanPid => {
    this.props.history.push(URLS.loanDetails(loanPid));
  };

  _getFormattedDate = d => (d ? toString(d) : '');

  _renderLoan = loan => {
    const updated = this._getFormattedDate(loan.updated);
    const startDate = this._getFormattedDate(loan.start_date);
    const endDate = this._getFormattedDate(loan.end_date);
    return (
      <Table.Row key={loan.loan_pid} data-test={loan.loan_pid}>
        <Table.Cell textAlign="center" collapsing>
          <Icon
            circular
            name="eye"
            link
            onClick={() => {
              this._handleRowClick(loan.loan_pid);
            }}
          />
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {loan.loan_pid}
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {loan.item_pid}
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {loan.state}
        </Table.Cell>
        <Table.Cell textAlign="center" collapsing>
          {updated}
        </Table.Cell>
        <Table.Cell>{startDate}</Table.Cell>
        <Table.Cell>{endDate}</Table.Cell>
      </Table.Row>
    );
  };

  _handleShowAllClick = () => {
    const { document_pid, item_pid } = this.props.item
      ? this.props.item.metadata
      : this.initProps;
    const patron_pid = this.props.patron ? this.props.patron : null;
    const loan_state = this.props.loanState ? this.props.loanState : null;
    const qs = loanApi.buildLoansQuery(
      document_pid,
      item_pid,
      loan_state,
      patron_pid
    );
    const url = `${URLS.loansSearch}?q=${qs}`;
    this.props.history.push(url);
  };

  _renderFooter = loans => {
    const total = loans.length;
    return total > this.props.showMaxLoans ? (
      <Table.Footer fullWidth className="footer" data-test="footer">
        <Table.Row>
          <Table.HeaderCell colSpan="6" />
          <Table.HeaderCell textAlign="right">
            <span>Showing first {this.props.showMaxLoans} user requests</span>
            <Button size="small" onClick={this._handleShowAllClick}>
              Show all
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    ) : null;
  };

  _handleSortClick = sortByValue => {
    const { document_pid, item_pid } = this.props.item
      ? this.props.item.metadata
      : this.initProps;
    const patron_pid = this.props.patron ? this.props.patron : null;
    const loan_state = this.props.loanState ? this.props.loanState : null;
    if (this.props.currentSortBy === sortByValue) {
      // change sort order
      this.patronLoansChangeSortOrder(
        document_pid,
        item_pid,
        loan_state,
        patron_pid
      );
    } else {
      // change sort by
      this.patronLoansChangeSortBy(
        document_pid,
        item_pid,
        loan_state,
        patron_pid
      );
    }
  };

  _renderLoans = loans => {
    const _loans = loans
      .slice(0, this.props.showMaxLoans)
      .map(loan => this._renderLoan(loan));
    return (
      <Table singleLine selectable className="item-pending-loans">
        <Table.Header className="header">
          <Table.Row data-test="header">
            <Table.HeaderCell />
            <Table.HeaderCell textAlign="center">Loan</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Item</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">State</Table.HeaderCell>
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
              <span>Loan start date</span>
              <Popup
                trigger={
                  <Icon
                    name="sort"
                    link
                    onClick={() => this._handleSortClick('start_date')}
                  />
                }
                content="Sort by start date asc/desc"
                size="mini"
                position="top center"
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <span>Loan end date</span>
              <Popup
                trigger={
                  <Icon
                    name="sort"
                    link
                    onClick={() => this._handleSortClick('end_date')}
                  />
                }
                content="Sort by end asc/desc"
                size="mini"
                position="top center"
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{_loans}</Table.Body>
        {this._renderFooter(loans)}
      </Table>
    );
  };

  _renderLoansOrEmpty = loans => {
    return loans.length ? (
      this._renderLoans(loans)
    ) : (
      <Message data-test="no-results">
        There are no loan requests from this user.
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
            <Header as="h3">User's loan requests</Header>
            {this._renderLoansOrEmpty(data)}
          </Segment>
        </Error>
      </Loader>
    );
  }
}

PatronLoansTable.propTypes = {
  item: PropTypes.object,
  patron: PropTypes.number,
  loanState: PropTypes.string,
  fetchPatronLoans: PropTypes.func.isRequired,
  patronLoansChangeSortBy: PropTypes.func.isRequired,
  patronLoansChangeSortOrder: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  currentSortBy: PropTypes.string.isRequired,
  currentSortOrder: PropTypes.string.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronLoansTable.defaultProps = {
  showMaxLoans: 5,
};
