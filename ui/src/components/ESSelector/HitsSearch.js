import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Search } from 'semantic-ui-react';
import { serializeError } from './serializer';

const initialState = {
  isLoading: false,
  hasError: false,
  results: [],
  query: null,
  value: '',
};

const ResultRenderer = ({ id, title, description, extra }) => (
  <div key={id} className="content">
    {extra && <div className="price">{extra}</div>}
    {title && <div className="title">{title}</div>}
    {description && <div className="description">{description}</div>}
  </div>
);

export class HitsSearch extends Component {
  state = initialState;

  constructor(props) {
    super(props);
    this.searchInputRef = null;
  }

  clear = () => this.setState(initialState);

  onSelectResult = (event, { result }) => {
    if (this.state.hasError) return;

    if (this.props.onSelect) {
      this.props.onSelect(result);
    }
    this.setState(initialState);
    this.searchInputRef.focus();
  };

  search = debounce(async searchQuery => {
    const serialize = this.props.serializer;
    try {
      const queryString = this.props.alwaysWildcard
        ? searchQuery + '*'
        : searchQuery;
      const response = await this.props.query(queryString);
      const results = [];
      for (let hit of response.data.hits) {
        results.push(serialize(hit));
      }
      if (this.props.onResults) {
        this.props.onResults(results);
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

    this.setState({ isLoading: true, value: value, query: value });
    this.search(value);
  };

  componentDidMount() {
    if (this.searchInputRef) {
      this.searchInputRef.focus();
    }
  }

  render() {
    const { hasError, isLoading, results, value } = this.state;
    return (
      <Search
        fluid
        id={this.props.id}
        name={this.props.name}
        className={
          hasError || this.context.patronSelectionError === 'true'
            ? 'error'
            : null
        }
        loading={isLoading}
        minCharacters={this.props.minCharacters}
        onResultSelect={this.onSelectResult}
        onSearchChange={this.onSearchChange}
        results={results}
        value={value}
        resultRenderer={ResultRenderer}
        placeholder={this.props.placeholder}
        input={{ ref: element => (this.searchInputRef = element) }}
      />
    );
  }
}

HitsSearch.propTypes = {
  delay: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  serializer: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
};
