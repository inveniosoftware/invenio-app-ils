import { Count } from 'react-searchkit';
import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SearchSortBy } from './components/SearchSortBy';
import { SearchSortOrder } from './components/SearchSortOrder';
import { SearchResultsPerPage } from './components/SearchResultsPerPage';
import { SearchControlsMobile } from './SearchControlsMobile';
import { SearchPagination } from './components';
import { getSearchConfig } from '../../config';

export class SearchControls extends Component {
  renderCount = totalResults => {
    return (
      <div className={'search-results-counter'}>
        {totalResults} results found
      </div>
    );
  };

  searchConfig = getSearchConfig('documents');

  render() {
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Grid columns={3} className={'search-controls'}>
            <Grid.Column width={4}>
              <Grid>
                <Grid.Column width={4}>{this.props.layoutToggle()}</Grid.Column>
                <Grid.Column width={12}>
                  <Count renderElement={this.renderCount} />
                  <SearchResultsPerPage searchConfig={this.searchConfig} />
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column
              width={8}
              textAlign={'center'}
              className={'search-pagination-column'}
            >
              <SearchPagination />
            </Grid.Column>
            <Grid.Column
              textAlign={'right'}
              width={4}
              className={'search-sort-options-column'}
            >
              <div className={'sort-by-filters'}>
                <SearchSortBy prefix={'Sort by:'} />
                <SearchSortOrder searchConfig={this.searchConfig} />
              </div>
            </Grid.Column>
          </Grid>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <SearchControlsMobile searchConfig={this.searchConfig} />
        </Responsive>
      </>
    );
  }
}

SearchControls.propTypes = {
  layoutToggle: PropTypes.func.isRequired,
};
