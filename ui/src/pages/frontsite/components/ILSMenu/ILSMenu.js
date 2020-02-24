import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';
import { authenticationService } from '@authentication/services';
import { FrontSiteRoutes, BackOfficeRoutes } from '@routes/urls';
import { RedirectToLoginButton } from '@authentication/components';

export default class ILSMenu extends Component {
  logout = async () => {
    try {
      await this.props.logout();
    } catch (e) {
      this.props.sendErrorNotification(
        'Logout',
        'Something went wrong. Please try to logout again.'
      );
    }
  };

  renderRightDropDown = userMenuText => {
    return (
      <Dropdown item text={userMenuText} icon="user">
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={FrontSiteRoutes.patronProfile}>
            Your Profile
          </Dropdown.Item>
          {authenticationService.hasRoles(this.props.user, [
            'admin',
            'librarian',
          ]) ? (
            <>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to={BackOfficeRoutes.home}>
                Backoffice
              </Dropdown.Item>
            </>
          ) : null}
          <Dropdown.Divider />
          <Dropdown.Item onClick={this.logout}>Sign out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  renderRightMenuItem = (userMenuText = '') => {
    return this.props.isAnonymous ? (
      <RedirectToLoginButton
        renderClass={Menu.Item}
        inverted
        className={'ils-menu-login-button'}
        icon={'sign in'}
        content={'Sign in'}
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
                    `Hello, ${this.props.user.username}`
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
                {this.renderRightMenuItem()}
              </Menu.Menu>
            </Container>
          </Menu>
        </Responsive>
      </>
    );
  }
}
