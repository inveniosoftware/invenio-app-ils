import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'semantic-ui-react';
import { QueryBuildHelper } from './components/QueryBuildHelper/';

export class SearchBar extends Component {
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
          icon={
            <Icon
              onClick={executeSearch}
              name="search"
              inverted
              circular
              link
            />
          }
          iconPosition="left"
          size="massive"
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
