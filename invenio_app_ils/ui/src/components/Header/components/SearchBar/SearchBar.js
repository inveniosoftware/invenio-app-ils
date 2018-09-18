import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

import './SearchBar.css';

class SearchBar extends Component {
  render() {
    let { placeholder } = this.props;
    placeholder = placeholder || 'Search for a book';

    return (
      <Input
        className="searchbar"
        icon="search"
        placeholder={placeholder}
        iconPosition="left"
      />
    );
  }
}

export default SearchBar;
