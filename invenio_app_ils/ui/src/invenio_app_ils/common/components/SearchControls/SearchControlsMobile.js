import { Count } from 'react-searchkit';
import React, { Component } from 'react';
import { Container, Dropdown, Menu, Sticky } from 'semantic-ui-react';
import { SearchResultsPerPage } from './components/SearchResultsPerPage';
import { SearchAggregationsMenu } from './components/SearchAggregations';
import { SearchSortBy } from './components/SearchSortBy';
import { SearchSortOrder } from './components/SearchSortOrder';
import { getSearchConfig } from '../../config';

export class SearchControlsMobile extends Component {
  searchConfig = getSearchConfig('documents');

  renderCount = totalResults => {
    return (
      <div className={'search-results-counter'}>
        {totalResults} results found
      </div>
    );
  };

  render() {
    return (
      <Container fluid className={'mobile-search-controls'}>
        <Sticky context={this.props.stickyRef} offset={66}>
          <Container fluid className={'fs-search-controls-mobile'}>
            <Menu fluid borderless>
              <Menu.Item header>
                <Count renderElement={this.renderCount} />
              </Menu.Item>
              <Menu.Menu>
                <Dropdown
                  text={'Filter'}
                  size={'small'}
                  pointing
                  className={'link item'}
                >
                  <Dropdown.Menu>
                    <SearchAggregationsMenu />
                  </Dropdown.Menu>
                </Dropdown>
                <SearchSortBy />
                <SearchSortOrder />
              </Menu.Menu>
            </Menu>
            <Container>
              <SearchResultsPerPage />
            </Container>
          </Container>
        </Sticky>
      </Container>
    );
  }
}
