import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import { Link as ScrollLink } from 'react-scroll';

export default class ScrollingMenuItem extends Component {
  render() {
    const { elementId, label, activeItem, setActiveLink, offset } = this.props;
    return (
      <Menu.Item
        name={elementId}
        active={activeItem === elementId}
        activeClass="active"
        as={ScrollLink}
        to={elementId}
        spy={true}
        onSetActive={() => setActiveLink(elementId)}
        offset={offset}
      >
        {label}
      </Menu.Item>
    );
  }
}

ScrollingMenuItem.propTypes = {
  elementId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setActiveLink: PropTypes.func,
  activeItem: PropTypes.string,
  offset: PropTypes.number.isRequired,
};

ScrollingMenuItem.defaultProps = {
  offset: 0,
};
