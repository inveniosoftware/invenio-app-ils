import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../../../../../../common/components';
import { formatter } from '../../../../../../../../../../common/components/ResultsTable/formatters';
import { pick } from 'lodash/object';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  _rowActions = row => {};

  prepareData(data) {
    return data.map(row => {
      let entry = pick(formatter.patron.toTable(row), ['ID', 'Name', 'Email']);
      entry['Actions'] = this._rowActions(row);
      return entry;
    });
  }

  render() {
    const rows = this.prepareData(this.props.results);

    return rows.length ? (
      <ResultsTable
        rows={rows}
        title={''}
        rowActionClickHandler={this.viewDetailsClickHandler}
      />
    ) : null;
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
