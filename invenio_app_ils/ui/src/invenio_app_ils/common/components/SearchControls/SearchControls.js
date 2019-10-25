import { Count } from 'react-searchkit';
import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SearchSortBy } from './components/SearchSortBy';
import { SearchSortOrder } from './components/SearchSortOrder';
import { SearchResultsPerPage } from './components/SearchResultsPerPage';
import { SearchControlsMobile } from './SearchControlsMobile';
import { SearchPagination } from './components';

export class SearchControls extends Component {

  renderCount = totalResults => {
    return (
      <div className={'search-results-counter'}>
        {totalResults} results found
      </div>
    );
  };

  render() {
    return (
      <>
        <Responsive {...Responsive.onlyComputer}>
          <Grid columns={3} className={'search-controls'}>
            <Grid.Column largeScreen={5} computer={6}>
              <Grid>
                {this.props.layoutToggle ?
                  <Grid.Column width={4}>
                    {this.props.layoutToggle()}
                  </Grid.Column> : null}
                <Grid.Column width={12}>
                  <Count renderElement={this.renderCount} />
                  <SearchResultsPerPage modelName={this.props.modelName} />
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
                <SearchSortBy modelName={this.props.modelName}
                              prefix={'Sort by '} />
                <SearchSortOrder modelName={this.props.modelName} />
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
          <SearchControlsMobile modelName={this.props.modelName} />
        </Responsive>
      </>
    );
  }
}

SearchControls.propTypes = {
  layoutToggle: PropTypes.func,
  modelName: PropTypes.string.isRequired,
};
