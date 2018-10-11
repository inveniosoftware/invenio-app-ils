import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';
import './LoanMetadata.scss';

class LoanMetadata extends Component {
  renderLoanMetadata(data) {
    return Object.keys(data.metadata).map(key => {
      return (
        <Table.Row key={key}>
          <Table.Cell collapsing>{key}</Table.Cell>
          <Table.Cell>{data.metadata[key]}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    let { data } = this.props;
    return (
      <List.Item>
        <List.Header>Loan Information</List.Header>
        <Table compact celled definition textAlign="center">
          <Table.Body>{this.renderLoanMetadata(data)}</Table.Body>
        </Table>
      </List.Item>
    );
  }
}

export default LoanMetadata;

LoanMetadata.propTypes = {
  data: PropTypes.object.isRequired,
};
