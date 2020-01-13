import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

export const SeriesImage = ({ metadata, ...props }) => {
  return (
    <Image
      centered
      wrapped
      src="/images/placeholder.png"
      size="small"
      {...props}
    />
  );
};

SeriesImage.propTypes = {
  metadata: PropTypes.object.isRequired,
};
