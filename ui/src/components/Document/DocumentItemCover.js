import { getCover } from '@components/Document/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import _get from 'lodash/get';

export default class DocumentItemCover extends Component {
  getLabel = () => {
    const { metadata } = this.props;
    const isRestricted = _get(metadata, 'restricted', false);
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
    const { linkTo, metadata, size, coverUrl, ...uiProps } = this.props;
    return (
      <Item.Image
        as={Link}
        to={linkTo}
        size={size}
        src={getCover(coverUrl)}
        onError={e => (e.target.style.display = 'none')}
        label={this.getLabel()}
        {...uiProps}
      />
    );
  }
}

DocumentItemCover.propTypes = {
  linkTo: PropTypes.string.isRequired,
  metadata: PropTypes.object.isRequired,
  coverUrl: PropTypes.string.isRequired,
};

DocumentItemCover.defaultProps = {
  size: 'tiny',
  coverUrl: '42',
};
