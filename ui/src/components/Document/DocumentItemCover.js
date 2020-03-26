import { getCover } from '@components/Document/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Item } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';

export default class DocumentItemCover extends Component {
  getRestrictions = document => {
    if (
      (!isEmpty(document) && document.open_access) ||
      (!isEmpty(document.metadata) && document.metadata.open_access)
    )
      return null;
    return {
      corner: 'left',
      color: 'red',
      icon: 'lock',
      title: `This record is restricted`,
    };
  };
  render() {
    const { linkTo, document, size, coverUrl, ...uiProps } = this.props;
    return (
      <Item.Image
        as={Link}
        to={linkTo}
        size={size}
        src={getCover(coverUrl)}
        onError={e => (e.target.style.display = 'none')}
        label={this.getRestrictions(document)}
        {...uiProps}
      />
    );
  }
}

DocumentItemCover.propTypes = {
  linkTo: PropTypes.string.isRequired,
  document: PropTypes.object.isRequired,
  coverUrl: PropTypes.string.isRequired,
};

DocumentItemCover.defaultProps = {
  size: 'tiny',
  coverUrl: '42',
};
