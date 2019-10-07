import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { BackOfficeRoutes } from '../../../../routes/urls';

const headerStyle = {
  borderRadius: 'unset',
};

class Header extends Component {
  render() {
    return (
      <Menu borderless inverted style={headerStyle}>
        <Menu.Item header position="left">
          <Link to={BackOfficeRoutes.home}>Invenio APP ILS</Link>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(Header);
