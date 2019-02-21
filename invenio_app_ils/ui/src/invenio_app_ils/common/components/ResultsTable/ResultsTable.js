import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Message, Header, Table, Grid } from 'semantic-ui-react';
import ResultsTableHeader from './ResultsTableHeader';
import ResultsTableBody from './ResultsTableBody';
import ResultsTableFooter from './ResultsTableFooter';

export class ResultsTable extends Component {
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
        <ResultsTableHeader
          columns={columns}
          withRowAction={this.props.rowActionClickHandler ? true : false}
        />
        <ResultsTableBody
          columns={columns}
          rows={rows.slice(0, showMaxRows)}
          rowActionClickHandler={this.props.rowActionClickHandler}
        />
        <ResultsTableFooter
          allRowsNumber={totalRows}
          showMaxRows={this.props.showMaxRows}
          seeAllComponent={this.props.seeAllComponent}
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

  _renderTitle() {
    const { title, subtitle, headerActionComponent } = this.props;
    const header = title ? (
      <Header as="h3" content={title} subheader={subtitle} />
    ) : null;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={13} verticalAlign={'middle'}>
            {header}
          </Grid.Column>
          <Grid.Column width={3} textAlign={'right'}>
            {headerActionComponent}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  render() {
    return (
      <Segment>
        {this._renderTitle()}
        {this._renderResultsOrEmpty()}
      </Segment>
    );
  }
}

ResultsTable.propTypes = {
  rows: PropTypes.array.isRequired,
  showMaxRows: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  headerActionComponent: PropTypes.node,
  rowActionClickHandler: PropTypes.func,
  seeAllComponent: PropTypes.node,
  singleLine: PropTypes.bool,
  fixed: PropTypes.bool,
};

ResultsTable.defaultProps = {
  showMaxRows: 10,
  title: '',
  subtitle: '',
  headerActionComponent: null,
  headerActionClickHandler: null,
  rowActionClickHandler: null,
  seeAllComponent: null,
  singleLine: false,
  fixed: false,
};
