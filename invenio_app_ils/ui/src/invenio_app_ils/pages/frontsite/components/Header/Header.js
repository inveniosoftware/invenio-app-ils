import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'semantic-ui-react';
import {
  authenticationService,
  sessionManager,
} from '../../../../authentication/services';
import { FrontSiteRoutes, BackOfficeRoutes } from '../../../../routes/urls';
import { LoginButton } from '../../../../common/components';
import { goToHandler } from '../../../../history';
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
          <Dropdown.Item onClick={goToHandler(BackOfficeRoutes.home)}>
            Backoffice
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              authenticationService.logout(FrontSiteRoutes.home);
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
          authenticationService.login(FrontSiteRoutes.home);
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
        widths={3}
      >
        <Menu.Item>
          <Link to="/">ILS</Link>
        </Menu.Item>
        <Menu.Item>{this.renderRightMenuItem()}</Menu.Item>
      </Menu>
    );
  }
}
