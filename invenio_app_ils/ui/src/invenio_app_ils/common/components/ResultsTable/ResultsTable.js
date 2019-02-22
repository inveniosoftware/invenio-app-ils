import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Message, Header, Table, Popup } from 'semantic-ui-react';
import ResultsTableHeader from './ResultsTableHeader';
import ResultsTableBody from './ResultsTableBody';
import ResultsTableFooter from './ResultsTableFooter';

export class ResultsTable extends Component {
  constructor(props) {
    super(props);
    this.actionClickHandler = this.props.actionClickHandler;
    this.showAllButton = this.props.showAllButton;
    this.actionComponent = this.props.actionComponent;
  }

  _renderTable = () => {
    const { rows, showMaxRows, singleLine, fixed } = this.props;
    const columns = rows ? Object.keys(rows[0]) : [];
    const totalRows =
      rows.totalHits > rows.length ? rows.totalHits : rows.length;
    return (
      <Table
        striped
        {...(singleLine ? { singleLine: true } : {})}
        {...(fixed ? { fixed: true } : {})}
        selectable
      >
        <ResultsTableHeader columns={columns} />
        <ResultsTableBody
          columns={columns}
          rows={rows.slice(0, showMaxRows)}
          actionClickHandler={this.actionClickHandler}
          actionComponent={this.actionComponent}
        />
        <ResultsTableFooter
          allRowsNumber={totalRows}
          showMaxRows={this.props.showMaxRows}
          showAllButton={this.showAllButton}
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
    const { name, popup } = this.props;
    if (popup) {
      const header = <Header as="h3">{name}</Header>;
      return (
        <Segment>
          <Popup content={popup} trigger={header} />
          {this._renderResultsOrEmpty()}
        </Segment>
      );
    }
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
  actionClickHandler: PropTypes.func.isRequired,
  showAllButton: PropTypes.node,
  actionComponent: PropTypes.node,
  wrapped: PropTypes.bool,
  popup: PropTypes.string,
};

ResultsTable.defaultProps = {
  showMaxRows: 10,
  name: 'results',
  actionComponent: null,
};
