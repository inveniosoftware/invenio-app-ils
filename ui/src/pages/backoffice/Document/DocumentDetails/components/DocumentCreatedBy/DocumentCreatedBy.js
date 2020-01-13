import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BackOfficeRoutes } from '@routes/urls';

export const DocumentCreatedBy = ({ metadata }) => {
  const createdBy = metadata.created_by;
  switch (createdBy.type) {
    case 'user_id':
      return (
        <Link to={BackOfficeRoutes.patronDetailsFor(createdBy.value)}>
          Patron {createdBy.value}
        </Link>
      );
    default:
      return `${createdBy.type}:${createdBy.value}`;
  }
};

DocumentCreatedBy.propTypes = {
  metadata: PropTypes.object.isRequired,
};
