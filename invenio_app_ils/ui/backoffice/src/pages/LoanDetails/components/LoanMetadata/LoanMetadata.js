import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Table } from 'semantic-ui-react';

class LoanMetadata extends Component {
  renderLoanMetadata(data) {
    return Object.keys(data.metadata).map(key => {
      return (
        <Table.Row key={key} name="loanMetadataRow">
          <Table.Cell collapsing>{key}</Table.Cell>
          <Table.Cell>{JSON.stringify(data.metadata[key])}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    let { data } = this.props;
    return (
      <div>
        <Header as="h1">Loan Information</Header>
        <Table compact celled definition textAlign="center">
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell>Property</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderLoanMetadata(data)}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default LoanMetadata;

LoanMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};
