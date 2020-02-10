import { getCover } from '@components/Document/utils';
import React, { Component } from 'react';
import { ILSImagePlaceholder } from '@components/ILSPlaceholder';
import { Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

export class DocumentCover extends Component {
  render() {
    const { document } = this.props;
    return (
      <ILSImagePlaceholder
        isLoading={this.props.isLoading}
        style={this.props.placeholderStyle}
      >
        <Image
          className="document-cover"
          src={
            !isEmpty(document.metadata)
              ? getCover(document.metadata.edition)
              : null
          }
          size={this.props.imageSize}
          centered
        />
      </ILSImagePlaceholder>
    );
  }
}

DocumentCover.propTypes = {
  document: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  imageSize: PropTypes.string,
  placeholderStyle: PropTypes.object,
};

DocumentCover.defaultProps = {
  isLoading: false,
  imageSize: 'large',
  placeholderStyle: { width: 350, height: 500 },
};
