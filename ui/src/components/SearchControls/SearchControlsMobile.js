import { Count } from 'react-searchkit';
import React, { Component } from 'react';
import { Container, Dropdown, Menu, Sticky } from 'semantic-ui-react';
import { SearchResultsPerPage } from './components/SearchResultsPerPage';
import { SearchAggregationsMenu } from './components/SearchAggregations';
import { SearchSortBy } from './components/SearchSortBy';
import { SearchSortOrder } from './components/SearchSortOrder';
import PropTypes from 'prop-types';
import { getSearchConfig } from '@config';
import isEmpty from 'lodash/isEmpty';

export class SearchControlsMobile extends Component {
  searchConfig = getSearchConfig(this.props.modelName);

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
                  disabled={isEmpty(this.searchConfig.FILTERS)}
                >
                  <Dropdown.Menu>
                    <SearchAggregationsMenu modelName={this.props.modelName} />
                  </Dropdown.Menu>
                </Dropdown>
                <SearchSortBy modelName={this.props.modelName} />
                <SearchSortOrder modelName={this.props.modelName} />
              </Menu.Menu>
            </Menu>
            <Container>
              <SearchResultsPerPage modelName={this.props.modelName} />
            </Container>
          </Container>
        </Sticky>
      </Container>
    );
  }
}

SearchControlsMobile.propTypes = {
  modelName: PropTypes.string.isRequired,
};
