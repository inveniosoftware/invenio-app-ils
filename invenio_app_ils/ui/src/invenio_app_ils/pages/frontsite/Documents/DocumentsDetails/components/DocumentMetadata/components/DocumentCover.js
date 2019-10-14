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
        style={{ width: 350, height: 500 }}
      >
        <Image
          className="document-cover"
          src={this.props.metadata ? getCover(this.props.metadata.pid) : null}
          size={'large'}
        />
      </ILSImagePlaceholder>
    );
  }
}

DocumentCover.propTypes = {
  documentDetails: PropTypes.object.isRequired,
  isLoading: PropTypes.object.isRequired,
};
