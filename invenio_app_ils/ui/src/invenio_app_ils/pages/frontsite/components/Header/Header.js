import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon, Menu, Dropdown } from 'semantic-ui-react';
import {
  authenticationService,
  sessionManager,
} from '../../../../authentication/services';
import { FrontSiteRoutes, BackOfficeRoutes } from '../../../../routes/urls';
import { LoginButton } from '../../../../common/components';
import { goToHandler } from '../../../../history';

export default class Header extends Component {
  renderRightDropDown = () => {
    const trigger = (
      <span>
        <Icon name="user" /> Hello, {sessionManager.user.username}
      </span>
    );

    return (
      <Dropdown item trigger={trigger}>
        <Dropdown.Menu>
          <Dropdown.Item onClick={goToHandler(FrontSiteRoutes.patronProfile)}>
            Your Profile
          </Dropdown.Item>
          {sessionManager.hasRoles(['admin', 'librarian']) ? (
            <>
              <Dropdown.Divider />
              <Dropdown.Item onClick={goToHandler(BackOfficeRoutes.home)}>
                Backoffice
              </Dropdown.Item>
            </>
          ) : null}
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
      <Menu borderless inverted fixed="top">
        <Container>
          <Menu.Item header position="left">
            <Link to="/">ILS</Link>
          </Menu.Item>
          <Menu.Item header position="right">
            {this.renderRightMenuItem()}
          </Menu.Item>
        </Container>
      </Menu>
    );
  }
}
