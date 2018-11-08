import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { URLS } from 'common/urls';

import './Sidebar.scss';

class Sidebar extends Component {
  state = { activeItem: '' };

  handleItemClick = (e, { name, location }) => {
    this.setState({ activeItem: name });
    this.props.history.push(location);
  };

  render() {
    const { activeItem } = this.state;
    return (
      <Menu vertical inverted fixed="left" className="sidebar-menu">
        <Menu.Header as="h2" className="logo">
          ILS backoffice
        </Menu.Header>
        <Menu.Item
          location={URLS.itemList}
          name="items"
          active={activeItem === 'items'}
          onClick={this.handleItemClick}
        >
          Items
        </Menu.Item>
        <Menu.Item
          name="loans"
          location={URLS.loanList}
          active={activeItem === 'loans'}
          onClick={this.handleItemClick}
        >
          Loans
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Sidebar);
