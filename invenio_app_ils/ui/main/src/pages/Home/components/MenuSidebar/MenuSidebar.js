import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import MenuSidebarItem from './components/MenuSidebarItem';

export default class MenuSidebar extends Component {
  renderMenuItem(item, index) {
    return (
      <MenuSidebarItem header={item.header} items={item.items} key={index} />
    );
  }

  render() {
    let { menuItems, divided } = this.props;
    return (
      <List verticalAlign="middle" divided={divided}>
        {menuItems.map(this.renderMenuItem)}
      </List>
    );
  }
}

MenuSidebar.defaultProps = {
  divided: true,
};

MenuSidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          content: PropTypes.string,
        })
      ),
    })
  ),
  divided: PropTypes.bool,
};
