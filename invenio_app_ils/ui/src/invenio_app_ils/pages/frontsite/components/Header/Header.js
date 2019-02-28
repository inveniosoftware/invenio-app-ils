import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'semantic-ui-react';
import { BackOfficeURLS } from '../../../../common/urls';
import SearchBar from './components/SearchBar';
import {
  authenticationService,
  sessionManager,
} from '../../../../authentication/services';
import { FrontSiteURLS } from '../../../../common/urls';
import { LoginButton } from '../../../../common/components';
import './Header.scss';

export default class Header extends Component {
  state = {};

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  renderRightDropDown = () => {
    const trigger = (
      <span>
        <Icon name="user" /> Hello, {sessionManager.user.username}
      </span>
    );
    return (
      <Dropdown item trigger={trigger}>
        <Dropdown.Menu>
          <Dropdown.Item>Your Requests</Dropdown.Item>
          <Dropdown.Item>Your Loans</Dropdown.Item>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              this.props.history.push(BackOfficeURLS.home);
            }}
          >
            Backoffice
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              authenticationService.logout(FrontSiteURLS.home);
            }}
          >
            Sign out
          </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  renderRightMenuItem = () => {
    return !sessionManager.authenticated ? (
      <LoginButton
        clickHandler={() => {
          authenticationService.login(FrontSiteURLS.home);
        }}
      />
    ) : (
      this.renderRightDropDown()
    );
  };
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
          <Link to="/">Library</Link>
        </Menu.Item>
        <Menu.Item>
          <SearchBar />
        </Menu.Item>
        <Menu.Item position="right">{this.renderRightMenuItem()}</Menu.Item>
      </Menu>
    );
  }
}
