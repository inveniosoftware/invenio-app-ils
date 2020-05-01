import { ResultsPerPage, SortBy, SortOrder } from 'react-searchkit';
import React, { Component } from 'react';

export class ResultsSort extends Component {
  render() {
    return this.props.searchConfig.SORT_BY.length ? (
      <div className={'search-results-page-size'}>
        <ResultsPerPage
          values={this.props.searchConfig.RESULTS_PER_PAGE}
          defaultValue={this.props.searchConfig.RESULTS_PER_PAGE[0].value}
          label={cmp => <> Show {cmp} results per page</>}
        />
        <div className={'search-results-sort-options'}>
          Sort by:{' '}
          <SortBy
            values={this.props.searchConfig.SORT_BY}
            defaultValue={this.props.searchConfig.SORT_BY[0].value}
            defaultValueOnEmptyString={
              this.props.searchConfig.SORT_BY_ON_EMPTY_QUERY
            }
          />
          <SortOrder
            values={this.props.searchConfig.SORT_ORDER}
            defaultValue={this.props.searchConfig.SORT_ORDER[0]['value']}
          />
        </div>
      </div>
    ) : null;
  }
}
