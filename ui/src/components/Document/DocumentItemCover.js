import { getCover } from '@components/Document/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import _get from 'lodash/get';

export default class DocumentItemCover extends Component {
  getLabel = metadata => {
    const isAccessed = _get(metadata, 'open_access', false);
    return isAccessed
      ? null
      : {
          corner: 'left',
          color: 'red',
          icon: 'lock',
          title: `This record is restricted`,
        };
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
        label={this.getLabel(metadata)}
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
