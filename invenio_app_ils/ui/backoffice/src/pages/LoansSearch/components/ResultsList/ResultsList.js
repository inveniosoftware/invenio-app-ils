import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';

class LoanRow extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = props.viewDetailsClickHandler;
  }

  render() {
    const loanRecord = this.props.loanRecord;
    const loan = loanRecord.metadata;

    return (
      <Table.Row key={loanRecord.id} data-test={loanRecord.id}>
        <Table.Cell textAlign="center">
          <Button
            circular
            compact
            icon="eye"
            onClick={() => {
              this.viewDetailsClickHandler(loanRecord.id);
            }}
          />
        </Table.Cell>
        <Table.Cell>{loanRecord.id}</Table.Cell>
        <Table.Cell data-test="mapped-status">{loan.state}</Table.Cell>
        <Table.Cell>{loan.patron_pid}</Table.Cell>
        <Table.Cell>{loan.item_pid}</Table.Cell>
        <Table.Cell>{loanRecord.created}</Table.Cell>
        <Table.Cell>{loan.start_date}</Table.Cell>
        <Table.Cell>{loan.end_date}</Table.Cell>
      </Table.Row>
    );
  }
}

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  render() {
    const _results = this.props.results.map(loanRecord => (
      <LoanRow
        key={loanRecord.id}
        loanRecord={loanRecord}
        viewDetailsClickHandler={this.viewDetailsClickHandler}
      />
    ));
    return _results.length ? (
      <Table singleLine striped>
        <Table.Header>
          <Table.Row data-test="header">
            <Table.HeaderCell collapsing />
            <Table.HeaderCell>Loan ID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Patron</Table.HeaderCell>
            <Table.HeaderCell>Item</Table.HeaderCell>
            <Table.HeaderCell>Loan request date</Table.HeaderCell>
            <Table.HeaderCell>From</Table.HeaderCell>
            <Table.HeaderCell>To</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{_results}</Table.Body>
      </Table>
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
