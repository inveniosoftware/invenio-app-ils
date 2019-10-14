import React, { Component } from 'react';
import { ILSImagePlaceholder } from '../../../../../../../common/ILSPlaceholder';
import { Image } from 'semantic-ui-react';
import { getCover } from '../../../../../config';
import PropTypes from 'prop-types';

export class DocumentCover extends Component {
  render() {
    return (
      <ILSImagePlaceholder
        isLoading={this.props.isLoading}
        style={
          this.props.placeholderStyle
            ? this.props.placeholderStyle
            : { width: 350, height: 500 }
        }
      >
        <Image
          className="document-cover"
          src={this.props.metadata ? getCover(this.props.metadata.pid) : null}
          size={this.props.imageSize ? this.props.imageSize : 'large'}
          centered
        />
      </ILSImagePlaceholder>
    );
  }
}

DocumentCover.propTypes = {
  documentDetails: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  imageSize: PropTypes.string,
  placeholderStyle: PropTypes.object,
};
