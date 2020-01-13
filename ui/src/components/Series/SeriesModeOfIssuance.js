import PropTypes from 'prop-types';

export const SeriesModeOfIssuance = ({ metadata }) => {
  switch (metadata.mode_of_issuance) {
    case 'SERIAL':
      return 'SERIAL';
    case 'MULTIPART_MONOGRAPH':
      return 'MULTIPART MONOGRAPH';
    default:
      return null;
  }
};

SeriesModeOfIssuance.propTypes = {
  metadata: PropTypes.object,
};
