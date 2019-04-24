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
import './ItemsSearch.scss';

export default class ItemsSearch extends Component {
  constructor(props) {
    super(props);
    this.fetchItems = this.props.fetchItems;
    this.updateQueryString = this.props.updateQueryString;
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
    this.fetchUpdatedCurrentLoans = this.props.fetchUpdatedCurrentLoans;
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

  _onPasteHandler = e => {
    let queryString = e.clipboardData.getData('Text');
    this.executeSearch(queryString).then(data => {
      if (this.props.items.hits[0].status === 'LOANABLE') {
        this.checkoutItem(this.props.items.hits[0], this.props.patron).then(
          () => {
            this.clearResults();
            this.fetchUpdatedCurrentLoans(this.props.patron);
          }
        );
      }
    });
  };

  _onKeyPressHandler = e => {
    if (e.key === 'Enter') {
      this.executeSearch();
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
          this._onPasteHandler(e);
        }}
        value={this.props.queryString}
        onKeyPress={event => {
          this._onKeyPressHandler(event);
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
        {this._renderHeader(results.hits.length)}
        <ItemsResultsList
          patron={this.props.patron}
          clearResults={this.clearResults}
          results={results}
          checkoutItem={this.checkoutItem}
          fetchPatronCurrentLoans={this.fetchUpdatedCurrentLoans}
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
          Found no items matching this barcode.
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
    return <p>Found {totalResults} item(s).</p>;
  };

  render() {
    const { items, isLoading, queryString, error } = this.props;
    return (
      <Segment className={'patron-items'}>
        <Header as={'h3'}>Items</Header>
        <Header.Subheader>Search items by barcode.</Header.Subheader>
        <Container className={'search-bar'}>
          {this._renderSearchBar()}
        </Container>
        <Grid columns={1} stackable relaxed className="items-search-container">
          <Grid.Column width={16}>
            <Loader isLoading={isLoading}>
              <Error error={error}>
                {!_isEmpty(items) && items.hits.length > 0
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
  fetchUpdatedCurrentLoans: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  checkoutItem: PropTypes.func.isRequired,
  patron: PropTypes.number.isRequired,
};

ItemsSearch.defaultProps = {
  queryString: '',
};
