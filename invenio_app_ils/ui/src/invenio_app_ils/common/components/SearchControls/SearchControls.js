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
        <Responsive {...Responsive.onlyComputer}>
          <Grid columns={3} className={'search-controls'}>
            <Grid.Column largeScreen={5} computer={6}>
              <Grid>
                <Grid.Column width={4}>{this.props.layoutToggle()}</Grid.Column>
                <Grid.Column width={12}>
                  <Count renderElement={this.renderCount} />
                  <SearchResultsPerPage searchConfig={this.searchConfig} />
                </Grid.Column>
              </Grid>
            </Grid.Column>
            <Grid.Column
              largeScreen={6}
              computer={4}
              textAlign={'center'}
              className={'search-pagination-column'}
            >
              <Responsive minWidth={Responsive.onlyLargeScreen.minWidth}>
                <SearchPagination />
              </Responsive>
            </Grid.Column>
            <Grid.Column
              textAlign={'right'}
              largeScreen={5}
              computer={6}
              className={'search-sort-options-column'}
            >
              <div className={'sort-by-filters'}>
                <SearchSortBy prefix={'Sort by '} />
                <SearchSortOrder searchConfig={this.searchConfig} />
              </div>
            </Grid.Column>
          </Grid>
        </Responsive>
        <Responsive maxWidth={Responsive.onlyLargeScreen.minWidth - 1}>
          <Grid>
            <Grid.Column width={16} textAlign="center">
              <SearchPagination />
            </Grid.Column>
          </Grid>
        </Responsive>
        <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
          <SearchControlsMobile searchConfig={this.searchConfig} />
        </Responsive>
      </>
    );
  }
}

SearchControls.propTypes = {
  layoutToggle: PropTypes.func.isRequired,
};
