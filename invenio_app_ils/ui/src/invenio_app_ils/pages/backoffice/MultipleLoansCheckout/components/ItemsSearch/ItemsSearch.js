import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { generatePath } from 'react-router';
import {
  Container,
  Grid,
  Segment,
  Icon,
  Header,
  Button,
  Input,
} from 'semantic-ui-react';
import { BackOfficeURLS } from '../../../../../common/urls';
import { Error, Loader } from '../../../../../common/components';
import { ResultsList as ItemsResultsList } from './components';
import _isEmpty from 'lodash/isEmpty';

export default class ItemsSearch extends Component {
  constructor(props) {
    super(props);
    this.fetchItems = this.props.fetchItems;
    this.updateQueryString = this.props.updateQueryString;
    this.addItemToBasket = this.props.addItemToBasket;
    this.clearResults = this.props.clearResults;
  }

  componentDidMount() {
    this.searchInput.focus();
  }

  onInputChange = queryString => {
    this.updateQueryString(queryString);
  };

  executeSearch = queryString => {
    if (queryString) {
      this.fetchItems(queryString);
    } else {
      this.fetchItems(this.props.queryString);
    }
  };

  _renderSearchBar = () => {
    return (
      <Input
        action={{
          content: 'Search',
          onClick: () => {
            this.executeSearch();
          },
        }}
        fluid
        focus
        placeholder={'Search by barcode...'}
        onChange={(e, { value }) => {
          this.onInputChange(value);
        }}
        onPaste={e => {
          let queryString = e.clipboardData.getData('Text');
          this.executeSearch(queryString);
        }}
        value={this.props.queryString}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            this.executeSearch();
          }
        }}
        ref={input => {
          this.searchInput = input;
        }}
      />
    );
  };

  _renderResultsList = results => {
    return (
      <div className="results-list">
        <ItemsResultsList
          addItemToBasket={this.addItemToBasket}
          removeItemFromBasket={this.removeItemFromBasket}
          clearResults={this.clearResults}
          results={results}
          viewDetailsClickHandler={itemPid => {
            const path = generatePath(BackOfficeURLS.itemDetails, {
              itemPid: itemPid,
            });
            this.props.history.push(path);
          }}
        />
      </div>
    );
  };

  _renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          Type barcode to search for items and press enter.
        </Header>
        <div className="empty-results-current">
          Current search phrase "{queryString}"
        </div>
        <Segment.Inline>
          <Button primary onClick={() => resetQuery('')}>
            Clear query
          </Button>
        </Segment.Inline>
      </Segment>
    );
  };

  _renderHeader = totalResults => {
    return (
      <Grid columns={3} verticalAlign="middle" stackable relaxed>
        <Grid.Column width={5} textAlign="left">
          <div>{totalResults} results</div>
        </Grid.Column>
      </Grid>
    );
  };

  render() {
    const { items, isLoading, hasError, queryString } = this.props;
    const errorData = hasError ? items : null;
    return (
      <Segment>
        <Header as={'h3'}>Items</Header>
        <Container>{this._renderSearchBar()}</Container>
        <Grid columns={1} stackable relaxed className="items-search-container">
          <Grid.Column width={16}>
            <Loader isLoading={isLoading}>
              <Error error={errorData}>
                {this._renderHeader(items.length)}
                {!(_isEmpty(items) && !hasError)
                  ? this._renderResultsList(items)
                  : this._renderEmptyResults(
                      queryString,
                      this.updateQueryString
                    )}
              </Error>
            </Loader>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

ItemsSearch.propTypes = {
  queryString: PropTypes.string,
  updateQueryString: PropTypes.func.isRequired,
  addItemToBasket: PropTypes.func.isRequired,
  items: PropTypes.array,
  fetchItems: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
};

ItemsSearch.defaultProps = {
  queryString: '',
};
