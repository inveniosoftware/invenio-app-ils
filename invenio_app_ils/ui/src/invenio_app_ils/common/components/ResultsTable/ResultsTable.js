import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Message, Header, Table } from 'semantic-ui-react';
import ResultsTableHeader from './ResultsTableHeader';
import ResultsTableBody from './ResultsTableBody';
import ResultsTableFooter from './ResultsTableFooter';

export class ResultsTable extends Component {
  constructor(props) {
    super(props);
    this.detailsClickHandler = this.props.detailsClickHandler;
    this.showAllClickHandler = this.props.showAllClickHandler;
  }

  _renderTable = () => {
    const { rows, showMaxRows } = this.props;
    const columns = rows ? Object.keys(rows[0]) : [];
    return (
      <Table striped singleLine selectable>
        <ResultsTableHeader columns={columns} />
        <ResultsTableBody
          columns={columns}
          rows={rows.slice(0, showMaxRows)}
          detailsClickHandler={this.detailsClickHandler}
        />
        <ResultsTableFooter
          allRowsNumber={rows.length}
          showMaxRows={this.props.showMaxRows}
          showAllClickHandler={this.showAllClickHandler}
          columnsNumber={columns.length}
        />
      </Table>
    );
  };

  _renderResultsOrEmpty() {
    const { rows, name } = this.props;
    return rows.length ? (
      this._renderTable(rows)
    ) : (
      <Message data-test="no-results">There are no {name}</Message>
    );
  }

  render() {
    const { name } = this.props;

    return (
      <Segment>
        <Header as="h3">{name}</Header>
        {this._renderResultsOrEmpty()}
      </Segment>
    );
  }
}

ResultsTable.propTypes = {
  rows: PropTypes.array.isRequired,
  showMaxRows: PropTypes.number,
  name: PropTypes.string,
  detailsClickHandler: PropTypes.func.isRequired,
  showAllClickHandler: PropTypes.object,
};

ResultsTable.defaultProps = {
  showMaxRows: 10,
  name: 'results',
};
