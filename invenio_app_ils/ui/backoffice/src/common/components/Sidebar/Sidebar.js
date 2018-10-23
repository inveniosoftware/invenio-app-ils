import React, { Component } from 'react';
import { Input, Menu } from 'semantic-ui-react';

export class Sidebar extends Component {
  state = { activeItem: '' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu vertical inverted fixed="left" className="sidebar-menu">
        <Menu.Item
          name="loans"
          active={activeItem === 'loans'}
          onClick={this.handleItemClick}
        >
          Loans
        </Menu.Item>

        <Menu.Item
          name="items"
          active={activeItem === 'items'}
          onClick={this.handleItemClick}
        >
          Items
        </Menu.Item>

        <Menu.Item>
          <Input icon="search" placeholder="Search..." />
        </Menu.Item>
      </Menu>
    );
  }
}
