import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Icon, Search } from 'semantic-ui-react';
import { serializeError } from './serializer';

const initialState = {
  isLoading: false,
  hasError: false,
  results: [],
  query: null,
  value: '',
  open: false,
};

const ResultRenderer = ({ id, title, description, extra }) => (
  <div key={id} className="content">
    {extra && <div className="price">{extra}</div>}
    {title && <div className="title">{title}</div>}
    {description && <div className="description">{description}</div>}
  </div>
);

export class HitsSearch extends Component {
  constructor(props) {
    super(props);
    this.searchInputRef = null;
    this.state = initialState;
  }

  clear = () => this.setState(initialState);

  onSelectResult = (event, { result }) => {
    if (this.state.hasError) return;
    if (this.props.onSelect) {
      this.props.onSelect(result);
    }

    /* controls closing of the results list in custom cases */
    if (result.disabled) {
      this.setState({ open: true });
    } else {
      this.setState(initialState);
    }

    this.searchInputRef.focus();
  };

  search = debounce(async searchQuery => {
    const serialize = this.props.serializer;
    try {
      const queryString = this.props.alwaysWildcard
        ? searchQuery + '*'
        : searchQuery;
      const response = await this.props.query(queryString);
      let results = [];

      if (serialize) {
        for (let hit of response.data.hits) {
          results.push(serialize(hit));
        }
        if (this.props.onResults) {
          this.props.onResults(results);
        }
      } else {
        results = response.data.hits;
      }

      const { value, query } = this.state;
      if (value !== query) {
        this.onSearchChange(null, { value: value });
      }

      this.setState({
        isLoading: false,
        hasError: false,
        nextQuery: null,
        results: results,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        hasError: true,
        results: [serializeError(error)],
      });
    }
  }, this.props.delay);

  onSearchChange = (event, { value }) => {
    if (this.props.onSearchChange) {
      this.props.onSearchChange(value);
    }
    if (value.length < this.props.minCharacters) {
      this.setState({ value });
      return;
    }

    this.setState({ isLoading: true, value: value, query: value, open: true });
    this.search(value);
  };

  componentDidMount() {
    if (this.searchInputRef) {
      this.searchInputRef.focus();
    }
    if (this.props.open !== undefined) {
      this.setState({ open: this.props.open });
    }
  }

  renderResults = ({ id, title, description, extra, ...props }) => {
    if (this.props.resultRenderer) {
      return this.props.resultRenderer({
        id,
        title,
        description,
        extra,
        ...props,
      });
    }
    return ResultRenderer({ id, title, description, extra });
  };

  renderNoResults = () => {
    const { isLoading } = this.state;
    return isLoading ? (
      <>
        <Icon loading name="circle notch" /> Loading ...
      </>
    ) : (
      'No results found.'
    );
  };

  render() {
    const { hasError, isLoading, results, value } = this.state;
    return (
      <Search
        fluid
        disabled={this.props.disabled}
        id={this.props.id}
        name={this.props.name}
        className={
          hasError || this.context.patronSelectionError === 'true'
            ? 'error'
            : null
        }
        open={this.state.open}
        loading={isLoading}
        minCharacters={this.props.minCharacters}
        onResultSelect={this.onSelectResult}
        onSearchChange={this.onSearchChange}
        noResultsMessage={this.renderNoResults()}
        results={results}
        value={this.props.value || value}
        resultRenderer={this.renderResults}
        placeholder={this.props.placeholder}
        input={{ ref: element => (this.searchInputRef = element) }}
      />
    );
  }
}

HitsSearch.propTypes = {
  delay: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  serializer: PropTypes.func,
  resultRenderer: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  minCharacters: PropTypes.number,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
};
