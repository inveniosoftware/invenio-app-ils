import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Menu } from 'semantic-ui-react';

class Sidebar extends Component {
  state = { activeItem: '' };

  handleItemClick = (e, { name, location }) => {
    this.setState({ activeItem: name });
    this.props.history.push(location);
  };

  render() {
    const { activeItem } = this.state;
    return (
      <Menu vertical inverted fixed="left" className="sidebar-menu">
        <Menu.Item
          name="loans"
          location="/backoffice/loans"
          active={activeItem === 'loans'}
          onClick={this.handleItemClick}
        >
          Loans
        </Menu.Item>

        <Menu.Item
          // href="/backoffice/items"
          location="/backoffice/items"
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

export default withRouter(Sidebar);
