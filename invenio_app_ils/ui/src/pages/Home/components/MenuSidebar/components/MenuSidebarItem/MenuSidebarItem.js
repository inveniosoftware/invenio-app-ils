import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

import './MenuSidebarItem.css';

export default class MenuSidebarItem extends Component {
  renderMenuItem(item, index) {
    return (
      <List.Item key={index} className="menu-item-item">
        <List.Icon name={item.icon} />
        <List.Content>
          <List.Item content={item.content} />
        </List.Content>
      </List.Item>
    );
  }

  render() {
    let { header, items } = this.props;
    return (
      <List.Item>
        <List.List>
          <List.Header content={header} className="menu-item-header" />
          {items.map(this.renderMenuItem)}
        </List.List>
      </List.Item>
    );
  }
}

MenuSidebarItem.propTypes = {
  header: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      content: PropTypes.string,
    })
  ),
};
