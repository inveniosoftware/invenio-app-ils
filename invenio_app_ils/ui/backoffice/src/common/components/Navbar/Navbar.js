import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

export class Navbar extends Component {
  render() {
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
          <Link to="/backoffice">CERN Library (backoffice)</Link>
        </Menu.Item>
      </Menu>
    );
  }
}
