import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Item, Placeholder } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export class LiteratureCover extends Component {
  getLabel = isRestricted => {
    return isRestricted
      ? {
          corner: 'left',
          color: 'red',
          icon: 'lock',
          title: 'Restricted',
        }
      : null;
  };

  render() {
    const { asItem, isRestricted, linkTo, size, url, ...uiProps } = this.props;
    const Cmp = asItem ? Item.Image : Image;
    const link = linkTo ? { as: Link, to: linkTo } : {};
    return url ? (
      <Cmp
        centered
        disabled={isRestricted}
        label={this.getLabel(isRestricted)}
        {...link}
        onError={e => (e.target.style.display = 'none')}
        src={url}
        size={size}
        {...uiProps}
      />
    ) : (
      <Placeholder>
        <Placeholder.Image square />
      </Placeholder>
    );
  }
}

LiteratureCover.propTypes = {
  asItem: PropTypes.bool,
  isRestricted: PropTypes.bool,
  linkTo: PropTypes.string,
  size: PropTypes.string,
  url: PropTypes.string,
};

LiteratureCover.defaultProps = {
  asItem: false,
  isRestricted: false,
  linkTo: null,
  size: 'large',
  url: null,
};
