import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { QueryBuildHelper } from './components/QueryBuildHelper/';

export class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  onChangeHandler = (e, { value }, onInputChange) => {
    onInputChange(value);
  };

  onKeyPressHandler = (event, executeSearch) => {
    if (event.key === 'Enter') {
      executeSearch();
    }
  };

  render() {
    const {
      currentQueryString,
      onInputChange,
      executeSearch,
      placeholder,
      queryHelperFields,
    } = this.props;
    return (
      <>
        <Input
          action={{
            content: 'Search',
            onClick: () => {
              executeSearch();
            },
          }}
          fluid
          placeholder={placeholder}
          onChange={(e, { value }) =>
            this.onChangeHandler(e, { value }, onInputChange)
          }
          value={currentQueryString}
          onKeyPress={event => this.onKeyPressHandler(event, executeSearch)}
          ref={input => {
            this.searchInput = input;
          }}
        />
        {queryHelperFields ? (
          <QueryBuildHelper
            fields={queryHelperFields}
            currentQueryString={currentQueryString}
            updateQueryString={onInputChange}
          />
        ) : null}
      </>
    );
  }
}

SearchBar.propTypes = {
  currentQueryString: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  executeSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  queryHelperFields: PropTypes.array,
};
