import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

export const SeriesCover = ({ coverUrl, fluid, size, ...props }) => {
  return (
    <Image
      centered
      wrapped
      fluid={fluid}
      src={coverUrl}
      size={fluid ? undefined : size}
      {...props}
    />
  );
};

SeriesCover.propTypes = {
  fluid: PropTypes.bool,
  coverUrl: PropTypes.string,
  size: PropTypes.string,
};

SeriesCover.defaultProps = {
  fluid: false,
  size: 'small',
};
