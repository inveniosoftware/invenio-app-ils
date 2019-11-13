import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';
import {
  authenticationService,
  sessionManager,
} from '../../../../authentication/services';
import { FrontSiteRoutes, BackOfficeRoutes } from '../../../../routes/urls';
import { LoginButton } from '../../../../common/components';

export default class ILSMenu extends Component {
  renderRightDropDown = userMenuText => {
    return (
      <Dropdown item text={userMenuText} icon="user">
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={FrontSiteRoutes.patronProfile}>
            Your Profile
          </Dropdown.Item>
          {sessionManager.hasRoles(['admin', 'librarian']) ? (
            <>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to={BackOfficeRoutes.home}>
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
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  renderRightMenuItem = (userMenuText = '') => {
    return !sessionManager.authenticated ? (
      <LoginButton
        clickHandler={() => {
          authenticationService.login(FrontSiteRoutes.home);
        }}
      />
    ) : (
      this.renderRightDropDown(userMenuText)
    );
  };

  render() {
    return (
      <>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Menu
            stackable
            borderless
            inverted
            fixed="top"
            className="header-menu"
          >
            <Container>
              <Menu.Item header>
                <Link to="/">ILS</Link>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  {this.renderRightMenuItem(
                    `Hello, ${sessionManager.user.username}`
                  )}
                </Menu.Item>
              </Menu.Menu>
            </Container>
          </Menu>
        </Responsive>
        <Responsive {...Responsive.onlyMobile}>
          <Menu borderless inverted fixed="top" className="mobile-header-menu">
            <Container>
              <Menu.Item header>
                <Link to="/">ILS</Link>
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>{this.renderRightMenuItem()}</Menu.Item>
              </Menu.Menu>
            </Container>
          </Menu>
        </Responsive>
      </>
    );
  }
}
