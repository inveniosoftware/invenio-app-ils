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
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
    this.fetchPatronCurrentLoans = this.props.fetchPatronCurrentLoans;
  }

  componentDidMount() {
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }

  onInputChange = queryString => {
    this.updateQueryString(queryString);
  };

  executeSearch = queryString => {
    if (queryString) {
      return this.fetchItems(queryString);
    } else {
      return this.fetchItems(this.props.queryString);
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
          this.executeSearch(queryString).then(data => {
            this.checkoutItem(this.props.items.hits[0], this.props.patron).then(
              () => {
                this.clearResults();
                setTimeout(() => {
                  this.fetchPatronCurrentLoans(this.props.patron);
                }, 3000);
              }
            );
          });
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
          patron={this.props.patron}
          clearResults={this.clearResults}
          results={results}
          checkoutItem={this.checkoutItem}
          fetchPatronCurrentLoans={this.fetchPatronCurrentLoans}
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
    const { items, isLoading, hasError, queryString, error } = this.props;
    return (
      <Segment>
        <Header as={'h3'}>Items</Header>
        <Container>{this._renderSearchBar()}</Container>
        <Grid columns={1} stackable relaxed className="items-search-container">
          <Grid.Column width={16}>
            <Loader isLoading={isLoading}>
              <Error error={error}>
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
  items: PropTypes.object,
  fetchItems: PropTypes.func.isRequired,
  fetchPatronCurrentLoans: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  checkoutItem: PropTypes.func.isRequired,
  patron: PropTypes.number.isRequired,
};

ItemsSearch.defaultProps = {
  queryString: '',
};
