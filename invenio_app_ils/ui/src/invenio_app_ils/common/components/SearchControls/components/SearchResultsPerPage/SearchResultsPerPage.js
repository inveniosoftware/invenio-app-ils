import React, { Component } from 'react';
import { ResultsPerPage } from 'react-searchkit';
import { getSearchConfig } from '../../../../config';

export default class SearchResultsPerPage extends Component {
  searchConfig = getSearchConfig('documents');
  render() {
    return (
      <>
        Show{' '}
        <ResultsPerPage
          values={this.searchConfig.RESULTS_PER_PAGE}
          defaultValue={this.searchConfig.RESULTS_PER_PAGE[0].value}
        />{' '}
        results per page
      </>
    );
  }
}
