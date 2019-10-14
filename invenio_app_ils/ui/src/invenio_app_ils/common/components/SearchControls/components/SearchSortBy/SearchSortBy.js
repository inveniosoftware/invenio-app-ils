import React, { Component } from 'react';
import { SortBy } from 'react-searchkit';
import PropTypes from 'prop-types';
import { Dropdown, Responsive } from 'semantic-ui-react';
import { getSearchConfig } from '../../../../config';

export default class SearchSortBy extends Component {
  searchConfig = getSearchConfig('documents');

  renderMobileElement = (currentSortBy, options, onValueChange) => {
    return (
      <Dropdown
        text={'Sort by'}
        size={'small'}
        pointing
        className={'link item'}
      >
        <Dropdown.Menu>
          <Dropdown.Header icon={'sort'} content={'Sort by'} />
          {options.map((element, index) => {
            return (
              <Dropdown.Item
                key={index}
                value={element.value}
                text={element.text}
                onClick={(e, { value }) => onValueChange(value)}
              />
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  renderSortBy = (currentSortBy, options, onValueChange) => {
    const _options = options.map((element, index) => {
      return { key: index, text: element.text, value: element.value };
    });
    return (
      <Dropdown
        selection
        options={_options}
        value={currentSortBy}
        onChange={(e, { value }) => onValueChange(value)}
      />
    );
  };

  render() {
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          {this.searchConfig.SORT_BY.length > 0 ? (
            <>
              <label>
                {this.props.prefix ? this.props.prefix + ' ' : null}
              </label>
              <SortBy
                values={this.searchConfig.SORT_BY}
                defaultValue={this.searchConfig.SORT_BY[0].value}
                defaultValueOnEmptyString={
                  this.searchConfig.SORT_BY_ON_EMPTY_QUERY
                }
                renderElement={this.renderSortBy}
              />
            </>
          ) : null}
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          {this.searchConfig.SORT_BY.length > 0 ? (
            <>
              <SortBy
                values={this.searchConfig.SORT_BY}
                defaultValue={this.searchConfig.SORT_BY[0].value}
                defaultValueOnEmptyString={
                  this.searchConfig.SORT_BY_ON_EMPTY_QUERY
                }
                renderElement={this.renderMobileElement}
              />
            </>
          ) : null}
        </Responsive>
      </>
    );
  }
}

SearchSortBy.propTypes = {
  prefix: PropTypes.string,
};
