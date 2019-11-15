import React, { Component } from 'react';
import { SortOrder } from 'react-searchkit';
import { Button, Dropdown, Icon, Responsive } from 'semantic-ui-react';
import { getSearchConfig } from '../../../../config';
import PropTypes from 'prop-types';

export default class SearchSortOrder extends Component {
  constructor(props) {
    super(props);
    this.buttons = {};
  }

  searchConfig = getSearchConfig(this.props.modelName);

  sortChangeHandler = (onValueChange, currentSortOrder, options) => {
    const value =
      currentSortOrder === options[0].value
        ? options[1].value
        : options[0].value;
    onValueChange(value);
  };

  renderMobileElement = (currentSortOrder, options, onValueChange) => {
    options.map((element, index) => {
      this.buttons[element.value] = (
        <Button
          icon
          basic
          value={element.value}
          onClick={(e, { value }) =>
            this.sortChangeHandler(onValueChange, currentSortOrder, options)
          }
          key={index}
          className={'fs-button-sort-mobile'}
        >
          <Icon
            name={
              element.value === 'asc'
                ? 'sort alphabet ascending'
                : 'sort alphabet descending'
            }
          />
        </Button>
      );
      return this.buttons;
    });

    return this.buttons[currentSortOrder];
  };

  renderElement = (currentSortOrder, options, onValueChange) => {
    const _options = options.map((element, index) => {
      return { key: index, text: element.text, value: element.value };
    });
    return (
      <Dropdown
        options={_options}
        pointing
        className="link item"
        value={currentSortOrder}
        onChange={(e, { value }) => onValueChange(value)}
      />
    );
  };

  render() {
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          {this.searchConfig.SORT_ORDER.length > 0 ? (
            <SortOrder
              values={this.searchConfig.SORT_ORDER}
              defaultValue={this.searchConfig.SORT_ORDER[0]['value']}
            />
          ) : null}
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          {this.searchConfig.SORT_ORDER.length > 0 ? (
            <SortOrder
              values={this.searchConfig.SORT_ORDER}
              defaultValue={this.searchConfig.SORT_ORDER[0]['value']}
              renderElement={this.renderMobileElement}
            />
          ) : null}
        </Responsive>
      </>
    );
  }
}

SearchSortOrder.propTypes = {
  modelName: PropTypes.string.isRequired,
};
