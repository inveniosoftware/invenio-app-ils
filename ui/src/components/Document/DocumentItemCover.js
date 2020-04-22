import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Item } from 'semantic-ui-react';

export default class DocumentItemCover extends Component {
  getLabel = () => {
    const { isRestricted } = this.props;
    return isRestricted
      ? {
          corner: 'left',
          color: 'red',
          icon: 'lock',
          title: `This record is restricted`,
        }
      : null;
  };

  render() {
    const { linkTo, size, isRestricted, coverUrl, ...uiProps } = this.props;
    return (
      <Item.Image
        as={Link}
        to={linkTo}
        size={size}
        src={coverUrl}
        onError={e => (e.target.style.display = 'none')}
        label={this.getLabel()}
        {...uiProps}
      />
    );
  }
}

DocumentItemCover.propTypes = {
  linkTo: PropTypes.string.isRequired,
  isRestricted: PropTypes.bool.isRequired,
  coverUrl: PropTypes.string.isRequired,
};

DocumentItemCover.defaultProps = {
  coverUrl: '',
  isRestricted: false,
  size: 'tiny',
};
