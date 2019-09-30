import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ResultsTable } from '../../../../../common/components';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { pick } from 'lodash/object';
import { ExportReactSearchKitResults } from '../../../components';
import { patron as patronApi } from '../../../../../common/api';

export class ResultsList extends Component {
  constructor(props) {
    super(props);
    this.viewDetailsClickHandler = this.props.viewDetailsClickHandler;
  }

  prepareData(data) {
    return data.map(row => {
      return pick(formatter.patron.toTable(row), ['ID', 'Name', 'Email']);
    });
  }

  render() {
    const rows = this.prepareData(this.props.results);
    const headerActionComponent = (
      <ExportReactSearchKitResults exportBaseUrl={patronApi.searchBaseURL} />
    );

    return (
      <ResultsTable
        rows={rows}
        title={''}
        headerActionComponent={headerActionComponent}
        rowActionClickHandler={this.viewDetailsClickHandler}
      />
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array.isRequired,
  viewDetailsClickHandler: PropTypes.func.isRequired,
};
