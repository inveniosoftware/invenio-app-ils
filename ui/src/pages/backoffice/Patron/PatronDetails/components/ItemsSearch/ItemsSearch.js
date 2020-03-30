import { recordToPidType } from '@api/utils';
import { Error, Loader, SearchBar } from '@components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { ItemsResultsList } from './components';
import _isEmpty from 'lodash/isEmpty';

export default class ItemsSearch extends Component {
  constructor(props) {
    super(props);
    this.fetchItems = this.props.fetchItems;
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
    this.updateQueryString = this.props.updateQueryString;
    // this state is needed for the paste action,
    // because components gets updated via input change
    // but we need altered behaviour for the paste action
    // and in this way the state from before update is preserved
    this.state = { prevSearchQuery: '' };
  }

  onInputChange = queryString => {
    this.updateQueryString(queryString);
  };

  executeSearch = queryString => {
    queryString = queryString || this.props.queryString;
    this.setState({ prevSearchQuery: queryString });
    return this.fetchItems(queryString);
  };

  onPasteHandler = async event => {
    let queryString = event.clipboardData.getData('Text');

    if (queryString) {
      await this.executeSearch(queryString);

      const { hits } = this.props.items;
      const hasOneHit =
        !_isEmpty(hits) &&
        hits.length === 1 &&
        hits[0].metadata.status === 'CAN_CIRCULATE';
      if (hasOneHit) {
        const documentPid = hits[0].metadata.document.pid;
        const itemPid = {
          type: recordToPidType(hits[0]),
          value: hits[0].metadata.pid,
        };
        this.checkoutItem(
          documentPid,
          itemPid,
          this.props.patronDetails.user_pid,
          true
        );
      }
      this.setState({ prevSearchQuery: '' });
    }
  };

  onKeyPressHandler = e => {
    if (e.key === 'Enter' && this.props.queryString) {
      this.executeSearch();
    }
  };

  onSearchClickHandler = event => this.executeSearch();

  renderResultsList = results => {
    return (
      <div className="results-list">
        <ItemsResultsList
          patronPid={this.props.patronDetails.user_pid}
          clearResults={this.clearResults}
          results={results}
          clearSearchQuery={this.clearSearchQuery}
        />
      </div>
    );
  };

  clearSearchQuery = () => {
    this.setState({ prevSearchQuery: '' });
    this.clearResults();
  };

  renderSearchPrompt = () => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search" />
          No barcode provided.
        </Header>
        <div className="empty-results-current">
          Type or paste the barcode to search for items
        </div>
      </Segment>
    );
  };

  render() {
    const { items, isLoading, error, queryString } = this.props;
    return (
      <>
        <Container className="search-bar spaced">
          <SearchBar
            action={{
              icon: 'search',
              onClick: this.onSearchClickHandler,
            }}
            currentQueryString={queryString}
            onInputChange={this.onInputChange}
            executeSearch={this.executeSearch}
            placeholder={'Type or paste to search for physical copies...'}
            onPaste={e => {
              this.onPasteHandler(e);
            }}
          />
        </Container>
        <Grid columns={1} stackable relaxed className="items-search-container">
          <Grid.Column width={16}>
            <Loader isLoading={isLoading}>
              <Error error={error}>
                {_isEmpty(queryString) && _isEmpty(items)
                  ? this.renderSearchPrompt()
                  : this.renderResultsList(items)}
              </Error>
            </Loader>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

ItemsSearch.propTypes = {
  updateQueryString: PropTypes.func.isRequired,
  queryString: PropTypes.string.isRequired,
  items: PropTypes.object,
  fetchItems: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  checkoutItem: PropTypes.func.isRequired,
  patronDetails: PropTypes.object.isRequired,
};
