import { Count, LayoutSwitcher } from 'react-searchkit';
import React, { Component } from 'react';
import { Grid, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SearchSortBy } from './components/SearchSortBy';
import { SearchSortOrder } from './components/SearchSortOrder';
import { SearchResultsPerPage } from './components/SearchResultsPerPage';
import { SearchControlsMobile } from './SearchControlsMobile';
import { SearchPagination } from './components';

export class SearchControls extends Component {
  render() {
    const { withLayoutSwitcher, defaultLayout } = this.props;
    return (
      <>
        <Responsive {...Responsive.onlyComputer}>
          <Grid columns={3} className={'search-controls'}>
            <Grid.Column largeScreen={5} computer={6}>
              <Grid columns={2}>
                {withLayoutSwitcher && (
                  <Grid.Column width={6}>
                    <LayoutSwitcher defaultLayout={defaultLayout} />
                  </Grid.Column>
                )}
                <Grid.Column width={10}>
                  <Count label={cmp => <div>{cmp} results found</div>} />
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
                <SearchSortBy modelName={this.props.modelName} />
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
  modelName: PropTypes.string.isRequired,
  withLayoutSwitcher: PropTypes.bool,
  defaultLayout: PropTypes.oneOf(['grid', 'list']),
};

SearchControls.defaultProps = {
  withLayoutSwitcher: true,
  defaultLayout: 'grid',
};
