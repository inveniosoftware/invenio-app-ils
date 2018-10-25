import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { URLS } from 'common/urls';

class LoanTable extends Component {
  navigateToDetails(loanId) {
    this.props.history.push(URLS.loanDetails(loanId));
  }

  renderData(loans) {
    return loans.map(loan => {
      let meta = loan.metadata;
      return (
        <Table.Row
          key={meta.loan_pid}
          onClick={() => this.navigateToDetails(meta.loan_pid)}
        >
          <Table.Cell collapsing>{meta.state}</Table.Cell>
          <Table.Cell collapsing>{meta.loan_pid}</Table.Cell>
          <Table.Cell collapsing>{meta.patron_pid}</Table.Cell>
          <Table.Cell collapsing>{meta.item_pid}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    let { data } = this.props;
    let loans = data.hits.hits;
    return (
      <Table selectable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>State</Table.HeaderCell>
            <Table.HeaderCell>Loan PID</Table.HeaderCell>
            <Table.HeaderCell>Patron PID</Table.HeaderCell>
            <Table.HeaderCell>Item PID</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderData(loans)}</Table.Body>
      </Table>
    );
  }
}

export default withRouter(LoanTable);
