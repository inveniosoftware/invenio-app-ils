import React, { Component } from 'react';
import { goTo } from '@history';
import { FrontSiteRoutes } from '@routes/urls';
import { SearchBar } from '@components/SearchBar';

export default class HomeSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }

  updateSearchQuery = (value, event) => {
    this.setState({ query: event.target.value });
  };

  onSearchExecute = () => {
    const query = encodeURIComponent(this.state.query);
    goTo(FrontSiteRoutes.documentsListWithQuery(query));
  };

  render() {
    return (
      <SearchBar
        currentQueryString={this.state.searchQuery}
        onInputChange={this.updateSearchQuery}
        executeSearch={this.onSearchExecute}
        placeholder={'Search for books, series, articles, publications...'}
        className={'fs-headline'}
      />
    );
  }
}
