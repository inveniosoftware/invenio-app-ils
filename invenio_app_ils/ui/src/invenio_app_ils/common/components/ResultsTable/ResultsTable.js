import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Header, Table, Grid } from 'semantic-ui-react';
import ResultsTableHeader from './ResultsTableHeader';
import ResultsTableBody from './ResultsTableBody';
import ResultsTableFooter from './ResultsTableFooter';

export class ResultsTable extends Component {
  renderTable = () => {
    const {
      rows,
      showMaxRows,
      showAllResults,
      singleLine,
      fixed,
      currentPage,
      paginationComponent,
      seeAllComponent,
    } = this.props;
    const columns = rows ? Object.keys(rows[0]) : [];
    const totalRows =
      rows.totalHits > rows.length ? rows.totalHits : rows.length;
    return (
      <Table
        striped
        compact
        selectable
        {...(singleLine ? { singleLine: true } : {})}
        {...(fixed ? { fixed: true } : {})}
      >
        <ResultsTableHeader columns={columns} />
        <ResultsTableBody
          columns={columns}
          rows={showAllResults ? rows : rows.slice(0, showMaxRows)}
          rowActionClickHandler={this.props.rowActionClickHandler}
        />
        <ResultsTableFooter
          allRowsNumber={totalRows}
          showAllResults={showAllResults}
          showMaxRows={showMaxRows}
          seeAllComponent={seeAllComponent}
          currentPage={currentPage}
          paginationComponent={paginationComponent}
          columnsNumber={columns.length}
        />
      </Table>
    );
  };

  renderResultsOrEmpty() {
    const { rows, name } = this.props;
    return rows.length ? (
      this.renderTable(rows)
    ) : (
      <Message data-test="no-results">There are no {name}.</Message>
    );
  }

  renderTitle() {
    const { title, subtitle, headerActionComponent } = this.props;
    const header = title ? (
      <Header as="h3" content={title} subheader={subtitle} />
    ) : null;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column
            width={headerActionComponent ? 8 : 16}
            verticalAlign="middle"
          >
            {header}
          </Grid.Column>
          <Grid.Column width={8} textAlign={'right'}>
            {headerActionComponent}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    return (
      <>
        {this.renderTitle()}
        {this.renderResultsOrEmpty()}
      </>
    );
  }
}

ResultsTable.propTypes = {
  rows: PropTypes.array.isRequired,
  showMaxRows: PropTypes.number,
  showAllResults: PropTypes.bool,
  currentPage: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  name: PropTypes.string,
  headerActionComponent: PropTypes.node,
  rowActionClickHandler: PropTypes.func,
  seeAllComponent: PropTypes.node,
  paginationComponent: PropTypes.node,
  singleLine: PropTypes.bool,
  fixed: PropTypes.bool,
};

ResultsTable.defaultProps = {
  showMaxRows: 10,
  showAllResults: false,
  currentPage: 1,
  title: '',
  subtitle: '',
  headerActionComponent: null,
  headerActionClickHandler: null,
  rowActionClickHandler: null,
  seeAllComponent: null,
  paginationComponent: null,
  singleLine: false,
  fixed: false,
};
