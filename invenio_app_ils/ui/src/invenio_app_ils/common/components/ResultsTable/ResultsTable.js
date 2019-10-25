import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Header, Table, Grid } from 'semantic-ui-react';
import ResultsTableHeader from './ResultsTableHeader';
import ResultsTableBody from './ResultsTableBody';
import ResultsTableFooter from './ResultsTableFooter';

export class ResultsTable extends Component {
  renderTable = () => {
    const {
      columns,
      currentPage,
      data,
      fixed,
      paginationComponent,
      seeAllComponent,
      showAllResults,
      showMaxRows,
      singleLine,
      totalHitsCount,
      headerActionComponent,
      ...tableProps
    } = this.props;

    return (
      <Table
        striped
        compact
        selectable
        unstackable
        {...tableProps}
        {...(singleLine ? { singleLine: true } : {})}
        {...(fixed ? { fixed: true } : {})}
      >
        <ResultsTableHeader columns={columns} />
        <ResultsTableBody
          columns={columns}
          rows={showAllResults ? data : data.slice(0, showMaxRows)}
        />
        <ResultsTableFooter
          allRowsNumber={totalHitsCount || data.length}
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
    const { data, name } = this.props;
    return data.length ? (
      this.renderTable()
    ) : (
      <Message data-test="no-results">There are no {name}.</Message>
    );
  }

  renderHeader() {
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
        {this.renderHeader()}
        {this.renderResultsOrEmpty()}
      </>
    );
  }
}

ResultsTable.propTypes = {
  columns: PropTypes.array.isRequired,
  currentPage: PropTypes.number,
  data: PropTypes.array.isRequired,
  headerActionComponent: PropTypes.node,
  name: PropTypes.string,
  paginationComponent: PropTypes.node,
  seeAllComponent: PropTypes.node,
  showAllResults: PropTypes.bool,
  showMaxRows: PropTypes.number,
  singleLine: PropTypes.bool,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  totalHitsCount: PropTypes.number,
};

ResultsTable.defaultProps = {
  currentPage: 1,
  headerActionComponent: null,
  paginationComponent: null,
  seeAllComponent: null,
  showAllResults: false,
  showMaxRows: 10,
  singleLine: false,
  subtitle: '',
  title: '',
};
