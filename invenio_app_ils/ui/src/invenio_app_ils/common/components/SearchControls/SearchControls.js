import {
  Count,
  Pagination,
  ResultsPerPage,
  SortBy,
  SortOrder,
} from 'react-searchkit';
import React, { Component } from 'react';
import { Dropdown, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class SearchControls extends Component {
  renderCount = totalResults => {
    return (
      <div className={'search-results-counter'}>
        {totalResults} results found
      </div>
    );
  };

  renderResultsPerPage = () => {
    return this.props.searchConfig.SORT_BY.length ? (
      <>
        Show{' '}
        <ResultsPerPage
          values={this.props.searchConfig.RESULTS_PER_PAGE}
          defaultValue={this.props.searchConfig.RESULTS_PER_PAGE[0].value}
        />{' '}
        results per page
      </>
    ) : null;
  };

  renderSortBy = (currentSortBy, options, onValueChange) => {
    const _options = options.map((element, index) => {
      return { key: index, text: element.text, value: element.value };
    });
    return (
      <Dropdown
        selection
        options={_options}
        value={currentSortBy}
        onChange={(e, { value }) => onValueChange(value)}
      />
    );
  };

  renderSortOptions = () => {
    return this.props.searchConfig.SORT_BY.length ? (
      <div className={'sort-by-filters'}>
        Sort by:{' '}
        <SortBy
          values={this.props.searchConfig.SORT_BY}
          defaultValue={this.props.searchConfig.SORT_BY[0].value}
          defaultValueOnEmptyString={
            this.props.searchConfig.SORT_BY_ON_EMPTY_QUERY
          }
          renderElement={this.renderSortBy}
        />
        <SortOrder
          values={this.props.searchConfig.SORT_ORDER}
          defaultValue={this.props.searchConfig.SORT_ORDER[0]['value']}
        />
      </div>
    ) : null;
  };

  render() {
    return (
      <Grid columns={3} className={'search-controls'}>
        <Grid.Column width={4}>
          <Grid>
            <Grid.Column width={4}>{this.props.layoutToggle()}</Grid.Column>
            <Grid.Column width={12}>
              <Count renderElement={this.renderCount} />
              {this.renderResultsPerPage()}
            </Grid.Column>
          </Grid>
        </Grid.Column>
        <Grid.Column
          width={8}
          textAlign={'center'}
          className={'search-pagination-column'}
        >
          <Pagination />
        </Grid.Column>
        <Grid.Column
          textAlign={'right'}
          width={4}
          className={'search-sort-options-column'}
        >
          {this.renderSortOptions()}
        </Grid.Column>
      </Grid>
    );
  }
}

SearchControls.propTypes = {
  searchConfig: PropTypes.object.isRequired,
  layoutToggle: PropTypes.func.isRequired,
};
