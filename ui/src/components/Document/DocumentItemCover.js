import { getCover } from '@components/Document/utils';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Item } from 'semantic-ui-react';

export default class DocumentItemCover extends Component {
  getRestrictions = meta => {
    if (meta.open_access) return null;
    return {
      corner: 'left',
      color: 'red',
      icon: 'lock',
      title: `This ${meta.document_type.toLowerCase()} is restricted`,
    };
  };
  render() {
    const { linkTo, document, size, src, ...uiProps } = this.props;
    return (
      <Item.Image
        as={Link}
        to={linkTo}
        size={size}
        src={src ? src : getCover(document.metadata.edition)}
        onError={e => (e.target.style.display = 'none')}
        label={this.getRestrictions(document.metadata)}
        {...uiProps}
      />
    );
  }
}

DocumentItemCover.propTypes = {
  linkTo: PropTypes.string.isRequired,
  document: PropTypes.object.isRequired,
};

DocumentItemCover.defaultProps = {
  size: 'tiny',
};
