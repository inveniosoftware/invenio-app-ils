import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Grid,
  Segment,
  Icon,
  Header,
  Button,
  Input,
} from 'semantic-ui-react';
import {Error, Loader} from '../../../../../common/components';
import {ItemsResultsList} from './components';
import isEmpty from 'lodash/isEmpty';
import {ES_DELAY} from "../../../../../common/config";

export default class ItemsSearch extends Component {
  constructor(props) {
    super(props);
    this.fetchItems = this.props.fetchItems;
    this.updateQueryString = this.props.updateQueryString;
    this.clearResults = this.props.clearResults;
    this.checkoutItem = this.props.checkoutItem;
    this.fetchUpdatedCurrentLoans = this.props.fetchUpdatedCurrentLoans;
    this.state = {prevSearchQuery: ''};
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
    this.setState({prevSearchQuery: queryString});

    return this.fetchItems(queryString);
  };

  onPasteHandler = async event => {
    let queryString = event.clipboardData.getData('Text');

    if (queryString) {
      await this.executeSearch(queryString);

      const {hits} = this.props.items;
      const hasOneHit =
        !isEmpty(hits) &&
        hits.length === 1 &&
        hits[0].metadata.status === 'CAN_CIRCULATE';
      if (hasOneHit) {
        const documentPid = hits[0].metadata.document.pid;
        const itemPid = hits[0].metadata.pid;
        await this.checkoutItem(
          documentPid,
          itemPid,
          this.props.patronPid,
          true
        );
        this.clearResults();
        setTimeout(() => {
          this.fetchUpdatedCurrentLoans(this.props.patronPid);
        }, ES_DELAY);
        this.setState({prevSearchQuery: ''});
      }
    }
  };

  onKeyPressHandler = e => {
    if (e.key === 'Enter' && this.props.queryString) {
      this.executeSearch();
    }
  };

  renderSearchBar = () => {
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
        onChange={(e, {value}) => {
          this.onInputChange(value);
        }}
        onPaste={e => {
          this.onPasteHandler(e);
        }}
        value={this.props.queryString}
        onKeyPress={event => {
          this.onKeyPressHandler(event.target);
        }}
        ref={input => {
          this.searchInput = input;
        }}
      />
    );
  };

  renderResultsList = results => {
    return (
      <div className="results-list">
        {this.renderHeader(results.hits.length)}
        <ItemsResultsList
          patronPid={this.props.patronPid}
          clearResults={this.clearResults}
          results={results}
          checkoutItem={this.checkoutItem}
          fetchPatronCurrentLoans={this.fetchUpdatedCurrentLoans}
        />
      </div>
    );
  };

  renderEmptyResults = (queryString, resetQuery) => {
    return (
      <Segment placeholder textAlign="center">
        <Header icon>
          <Icon name="search"/>
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

  renderHeader = totalResults => {
    return <p>Found {totalResults} item(s).</p>;
  };

  render() {
    const {items, isLoading, error} = this.props;
    const {prevSearchQuery} = this.state;
    return (
      <Segment className={'patron-items'}>
        <Header as={'h3'}>Items</Header>
        <Header.Subheader>Search items by barcode.</Header.Subheader>
        <Container
          className={'search-bar'}>{this.renderSearchBar()}</Container>
        <Grid columns={1} stackable relaxed className="items-search-container">
          <Grid.Column width={16}>
            <Loader isLoading={isLoading}>
              <Error error={error}>
                {!isEmpty(items.hits)
                  ? this.renderResultsList(items)
                  : this.renderEmptyResults(
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
  patronPid: PropTypes.string.isRequired,
};

ItemsSearch.defaultProps = {
  queryString: '',
};
