import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

export default class ScrollingMenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: props.children[0].elementId };
  }

  setActiveLink = elementId => {
    this.setState({ activeItem: elementId });
  };

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        setActiveLink: this.setActiveLink,
        activeItem: this.state.activeItem,
        offset: this.props.offset,
      })
    );

    return (
      <Menu pointing secondary vertical fluid className="left">
        {childrenWithProps}
      </Menu>
    );
  }
}
