import { adminRoutes } from '@routes/urls';
import React, { Component } from 'react';
import { Divider, Menu } from 'semantic-ui-react';

export default class AdminMenu extends Component {
  render() {
    return (
      <>
        <Divider horizontal>Admin menu</Divider>
        <Menu text vertical className="bo-menu">
          <Menu.Item as={'a'} href={adminRoutes.admin}>
            Admin panel
          </Menu.Item>
          <Menu.Item as={'a'} href={adminRoutes.staticPages}>
            Static pages
          </Menu.Item>
        </Menu>
      </>
    );
  }
}
