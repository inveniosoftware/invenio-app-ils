import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { QueryBuildHelper } from './components/QueryBuildHelper/';

export class SearchBar extends Component {
  onChangeHandler = (e, { value }, onInputChange) => {
    onInputChange(value, e);
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
      buttonColor,
      ...otherProps
    } = this.props;
    return (
      <>
        <Input
          action={{
            color: buttonColor,
            icon: 'search',
            onClick: executeSearch,
          }}
          size="big"
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
          {...otherProps}
          className={`${otherProps.className} ils-searchbar`}
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
  currentQueryString: PropTypes.string,
  onInputChange: PropTypes.func.isRequired,
  executeSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  queryHelperFields: PropTypes.array,
  buttonColor: PropTypes.string,
};
