import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

export const SeriesImage = ({ fluid, metadata, size, ...props }) => {
  return (
    <Image
      centered
      wrapped
      fluid={fluid}
      src={metadata.cover_metadata.urls.large}
      size={fluid ? undefined : size}
      {...props}
    />
  );
};

SeriesImage.propTypes = {
  fluid: PropTypes.bool,
  metadata: PropTypes.object,
  size: PropTypes.string,
};

SeriesImage.defaultProps = {
  fluid: false,
  size: 'small',
};
