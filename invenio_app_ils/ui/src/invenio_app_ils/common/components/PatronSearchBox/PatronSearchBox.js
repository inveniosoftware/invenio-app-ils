import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react';
import { debounce } from 'lodash';
import { patron as patronApi } from '../../api';

export class PatronSearchBox extends Component {
  constructor(props) {
    super(props);
    this.minCharacters = props.minCharacters;
    this.state = {
      isLoading: false,
      value: '',
      results: [],
    };
  }

  mapResults = hits => {
    return hits.map(patron => {
      return {
        title: patron.metadata.email,
        description: patron.metadata.id.toString(),
        id: patron.metadata.email,
      };
    });
  };

  resetSearchBox = () =>
    this.setState({ isLoading: false, value: '', results: [] });

  handleResultSelect = (e, { result }) => {
    this.props.handleUpdateSelection(result);
    this.resetSearchBox();
  };

  performSearch = async function(queryText) {
    return await patronApi.list(queryText);
  };

  debouncedSearch = debounce(function(query) {
    this.performSearch(query).then(response => {
      this.setState({
        isLoading: false,
        results: this.mapResults(response.data.hits),
      });
    });
  }, 500);

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value: value });

    if (value.length >= this.minCharacters) {
      this.debouncedSearch(value);
    } else {
      this.setState({
        isLoading: false,
        results: [],
      });
    }
  };

  renderSearchBox = () => {
    const { isLoading, value, results } = this.state;
    return (
      <Search
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        results={results}
        value={value}
        disabled={this.props.disabledSearch}
      />
    );
  };

  render() {
    return this.renderSearchBox();
  }
}

PatronSearchBox.propTypes = {
  minCharacters: PropTypes.number.isRequired,
  handleUpdateSelection: PropTypes.func.isRequired,
  disabledSearch: PropTypes.bool,
};

PatronSearchBox.defaultPropTypes = {
  disabledSearch: false,
};
