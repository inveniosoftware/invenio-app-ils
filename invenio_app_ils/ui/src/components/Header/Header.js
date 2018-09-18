import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'semantic-ui-react';

import Searchbar from './components/SearchBar';

import './Header.css';

export default class Header extends Component {
  state = {};

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const trigger = (
      <span>
        <Icon name="user" /> Hello, Bob
      </span>
    );

    return (
      <Menu
        stackable
        borderless
        fluid
        fixed="top"
        inverted
        className="header-menu"
      >
        <Menu.Item header className="logo">
          <Link to="/">CERN Library</Link>
        </Menu.Item>
        <Menu.Item>
          <Searchbar />
        </Menu.Item>
        <Menu.Item position="right">
          <Dropdown item trigger={trigger}>
            <Dropdown.Menu>
              <Dropdown.Item>Your Requests</Dropdown.Item>
              <Dropdown.Item>Your Loans</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Menu>
    );
  }
}
