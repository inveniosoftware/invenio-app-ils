import React, { Component } from 'react';
import { ILSImagePlaceholder } from '@components/ILSPlaceholder';
import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export class DocumentCover extends Component {
  render() {
    const { coverUrl, isLoading, imageSize, placeholderStyle } = this.props;
    return (
      <ILSImagePlaceholder isLoading={isLoading} style={placeholderStyle}>
        <Image src={coverUrl} size={imageSize} centered />
      </ILSImagePlaceholder>
    );
  }
}

DocumentCover.propTypes = {
  coverUrl: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  imageSize: PropTypes.string,
  placeholderStyle: PropTypes.object,
};

DocumentCover.defaultProps = {
  isLoading: false,
  imageSize: 'large',
  placeholderStyle: { width: 350, height: 500 },
};
