import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';

class DocumentRow extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = props.viewDetailsClickHandler;
  }

  render() {
    const DocumentRecord = this.props.DocumentRecord;
    const Document = DocumentRecord.metadata;

    return (
      <Table.Row key={DocumentRecord.id} data-test={DocumentRecord.id}>
        <Table.Cell textAlign="center">
          <Button
            circular
            compact
            icon="eye"
            onClick={() => {
              this.viewDetailsClickHandler(DocumentRecord.id);
            }}
          />
        </Table.Cell>
        <Table.Cell>{DocumentRecord.id}</Table.Cell>
        <Table.Cell data-test="mapped-status">{Document.title}</Table.Cell>
        <Table.Cell>{Document.authors}</Table.Cell>
        <Table.Cell>{`${Document.abstracts[0].substring(
          0,
          50
        )}...`}</Table.Cell>
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
    const _results = this.props.results.map(DocumentRecord => (
      <DocumentRow
        key={DocumentRecord.id}
        DocumentRecord={DocumentRecord}
        viewDetailsClickHandler={this.viewDetailsClickHandler}
      />
    ));
    return _results.length ? (
      <Table striped singleLine selectable>
        <Table.Header>
          <Table.Row data-test="header">
            <Table.HeaderCell collapsing />
            <Table.HeaderCell>Document PID</Table.HeaderCell>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Authors</Table.HeaderCell>
            <Table.HeaderCell>Abstract</Table.HeaderCell>
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
