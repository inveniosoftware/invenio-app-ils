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
    this.state = { prevSearchQuery: '' };
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
    queryString = queryString || this.props.queryString;
    this.setState({ prevSearchQuery: queryString });

    return this.fetchItems(queryString);
  };

  _onPasteHandler = async event => {
    let queryString = event.clipboardData.getData('Text');

    if (queryString) {
      await this.executeSearch(queryString);

      const { hits } = this.props.items;
      const hasOneHit =
        !_isEmpty(hits) &&
        hits.length === 1 &&
        hits[0].metadata.status === 'CAN_CIRCULATE';
      if (hasOneHit) {
        await this.checkoutItem(hits[0], this.props.patron);
        this.clearResults();
        this.fetchUpdatedCurrentLoans(this.props.patron);
        this.setState({ prevSearchQuery: '' });
      }
    }
  };

  _onKeyPressHandler = e => {
    if (e.key === 'Enter' && this.props.queryString) {
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
    const { items, isLoading, error } = this.props;
    const { prevSearchQuery } = this.state;
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
                {!_isEmpty(items.hits)
                  ? this._renderResultsList(items)
                  : this._renderEmptyResults(
                      prevSearchQuery,
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
