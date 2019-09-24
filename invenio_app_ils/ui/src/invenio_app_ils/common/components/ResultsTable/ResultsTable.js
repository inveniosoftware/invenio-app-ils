import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { Segment, Message, Header, Table, Grid } from 'semantic-ui-react';
import ResultsTableHeader from './ResultsTableHeader';
import ResultsTableBody from './ResultsTableBody';
import ResultsTableFooter from './ResultsTableFooter';
import { formatter } from './formatters';

export class ResultsTable extends Component {
  constructor(props) {
    super(props);
    this.rows = [];
    this.columns = [];
    this.totalRows = 0;
  }

  prepareData = () => {
    const { data, entity, displayProps, hideProps } = this.props;
    return data.map(row => {
      if (displayProps) return pick(formatter[entity](row), displayProps);
      if (hideProps) return omit(formatter[entity](row), hideProps);
    });
  };

  renderTable = () => {
    const { showMaxRows, singleLine, fixed } = this.props;
    return (
      <Table
        striped
        {...(singleLine ? { singleLine: true } : {})}
        {...(fixed ? { fixed: true } : {})}
        selectable
      >
        <ResultsTableHeader
          columns={this.columns}
          withRowAction={this.props.rowActionClickHandler ? true : false}
        />
        <ResultsTableBody
          columns={this.columns}
          rows={this.rows.slice(0, showMaxRows)}
          rowActionClickHandler={this.props.rowActionClickHandler}
        />
        <ResultsTableFooter
          allRowsNumber={this.totalRows}
          showMaxRows={this.props.showMaxRows}
          seeAllComponent={this.props.seeAllComponent}
          currentPage={this.props.currentPage}
          paginationComponent={this.props.paginationComponent}
          columnsNumber={this.columns.length}
        />
      </Table>
    );
  };

  renderResultsOrEmpty = () => {
    const { name } = this.props;
    return this.rows.length ? (
      this.renderTable(this.rows)
    ) : (
      <Message data-test="no-results">There are no {name}.</Message>
    );
  };

  renderTitle = () => {
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
  };

  render() {
    this.rows = this.prepareData();
    this.columns = this.rows ? Object.keys(this.rows[0]) : [];
    this.totalRows =
      this.rows.totalHits > this.rows.length
        ? this.totalHits
        : this.rows.length;

    if (this.props.renderSegment) {
      return (
        <Segment>
          {this.renderTitle()}
          {this.renderResultsOrEmpty()}
        </Segment>
      );
    }
    return (
      <>
        {this.renderTitle()}
        {this.renderResultsOrEmpty()}
      </>
    );
  }
}

ResultsTable.propTypes = {
  data: PropTypes.array.isRequired,
  entity: PropTypes.string.isRequired,
  displayProps: PropTypes.array,
  hideProps: PropTypes.array,

  showMaxRows: PropTypes.number,
  currentPage: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  name: PropTypes.string,
  renderSegment: PropTypes.bool,
  headerActionComponent: PropTypes.node,
  rowActionClickHandler: PropTypes.func,
  seeAllComponent: PropTypes.node,
  paginationComponent: PropTypes.node,
  singleLine: PropTypes.bool,
  fixed: PropTypes.bool,
};

ResultsTable.defaultProps = {
  data: [],

  showMaxRows: 10,
  currentPage: 1,
  title: '',
  subtitle: '',
  renderSegment: true,
  headerActionComponent: null,
  headerActionClickHandler: null,
  rowActionClickHandler: null,
  seeAllComponent: null,
  paginationComponent: null,
  singleLine: false,
  fixed: false,
};
